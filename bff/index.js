if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const passport = require("passport");
const OAuth2Strategy = require("passport-oauth2");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const axios = require("axios");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.PORT;
app.set("trust proxy", 1);

const MySQLStore = require("express-mysql-session")(session);

const options = {
  host: process.env.SESSION_STORE_DB_HOST,
  port: process.env.SESSION_STORE_DB_PORT,
  user: process.env.SESSION_STORE_DB_USER,
  password: process.env.SESSION_STORE_DB_PASSWORD,
  database: process.env.SESSION_STORE_DB_DATABASE,
};

const sessionStore = new MySQLStore(options);

const OAUTH_CONFIG = {
  authorizationURL: process.env.OAUTH_AUTHORIZATION_URL,
  tokenURL: process.env.OAUTH_TOKEN_URL,
  clientID: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
  callbackURL: process.env.OAUTH_CALLBACK_URL,
};

const RESOURCE_SERVER_URL = process.env.RESOURCE_SERVER_URL;

app.use(morgan("combined"));

passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: OAUTH_CONFIG.authorizationURL,
      tokenURL: OAUTH_CONFIG.tokenURL,
      clientID: OAUTH_CONFIG.clientID,
      clientSecret: OAUTH_CONFIG.clientSecret,
      callbackURL: OAUTH_CONFIG.callbackURL,
      scope: ["openid", "profile", "email"],
    },
    async (accessToken, refreshToken, params, done) => {
      try {
        const profile = jwt.decode(params.id_token || accessToken);
        const user = {
          accessToken,
          refreshToken,
          profile,
        };
        return done(null, user);
      } catch (error) {
        console.error("Error decoding token:", error.message);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

let destroySession = async (req, res) => {
  const tokenRevocationURL =
    "https://ronaldjro.dev/auth/realms/KitchenCompanion/protocol/openid-connect/revoke";

  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const { accessToken, refreshToken } = req.user;

  try {
    await axios.post(
      tokenRevocationURL,
      new URLSearchParams({
        token: accessToken,
        client_id: OAUTH_CONFIG.clientID,
        client_secret: OAUTH_CONFIG.clientSecret,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    if (refreshToken) {
      await axios.post(
        tokenRevocationURL,
        new URLSearchParams({
          token: refreshToken,
          client_id: OAUTH_CONFIG.clientID,
          client_secret: OAUTH_CONFIG.clientSecret,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
    }

    req.logout((err) => {
      if (err) {
        console.error("Error logging out:", err);
        return res.status(500).json({ error: "Failed to log out" });
      }

      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          return res.status(500).json({ error: "Failed to destroy session" });
        }

        res.clearCookie("connect.sid", {
          path: "/",
          httpOnly: true,
          secure: "auto",
          sameSite: "lax",
        });

        res.status(200).json({ message: "Logged out successfully" });
      });
    });
  } catch (error) {
    console.error(
      "Error revoking tokens:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to revoke tokens" });
  }
};

const introspectToken = async (token) => {
  try {
    const response = await axios.post(
      `https://ronaldjro.dev/auth/realms/KitchenCompanion/protocol/openid-connect/token/introspect`,
      new URLSearchParams({
        token: token,
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    return response.data.active;
  } catch (error) {
    console.error(
      "Error during token introspection:",
      error.response?.data || error.message
    );
    return false;
  }
};

const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(
      `https://ronaldjro.dev/auth/realms/KitchenCompanion/protocol/openid-connect/token`,
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    };
  } catch (error) {
    console.error(
      "Error refreshing token:",
      error.response?.data || error.message
    );
    return null;
  }
};

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      secure: "auto",
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(async (req, res, next) => {
  if (req.isAuthenticated() && req.user?.accessToken) {
    try {
      const isValid = await introspectToken(req.user.accessToken);

      if (!isValid) {
        const newTokens = await refreshAccessToken(req.user.refreshToken);

        if (!newTokens) {
          req.logout((err) => {
            if (err) {
              console.error("Error logging out:", err);
            }
            res
              .status(401)
              .json({ error: "Session expired. Please log in again." });
          });
          return;
        }

        req.user.accessToken = newTokens.accessToken;
        req.user.refreshToken = newTokens.refreshToken || req.user.refreshToken;
        req.session.passport.user = req.user;
      }
      next();
    } catch (error) {
      console.error("Error validating or refreshing token:", error.message);
      res.status(500).json({ error: "Internal server error." });
    }
  } else {
    next();
  }
});

app.get(
  "/login",
  passport.authenticate("oauth2", {
    scope: ["openid", "profile", "email"],
  })
);

app.get(
  "/callback",
  passport.authenticate("oauth2", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL);
  }
);

app.get("/session", (req, res) => {
  if (req.isAuthenticated()) {
    const { profile } = req.user;

    const safeUserData = {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
    };

    res.json({ authenticated: true, user: safeUserData });
  } else {
    res.json({ authenticated: false });
  }
});

const proxyConfig = createProxyMiddleware({
  target: RESOURCE_SERVER_URL, // Your resource server
  changeOrigin: true,
  logLevel: "debug",
  pathRewrite: {
    "^/api": "",
  },
  on: {
    proxyReq: (proxyReq, req, res) => {

      proxyReq.setHeader("Session-Id", req.sessionID || "");
      
      if (req.isAuthenticated()) {
        let accessToken = req.user.accessToken;
        proxyReq.setHeader("Authorization", `Bearer ${accessToken}`);
      }
    },
  },
});

app.use("/api", proxyConfig);

app.get("/logout", destroySession);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
