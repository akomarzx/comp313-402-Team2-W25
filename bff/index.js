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

const app = express();
const PORT = process.env.PORT;

// OAuth Configuration
const OAUTH_CONFIG = {
  authorizationURL: process.env.OAUTH_AUTHORIZATION_URL,
  tokenURL: process.env.OAUTH_TOKEN_URL,
  clientID: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
  callbackURL: process.env.OAUTH_CALLBACK_URL,
};

const RESOURCE_SERVER_URL = process.env.RESOURCE_SERVER_URL;

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

app.use(cors());
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Middleware
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

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
// Proxy Middleware for All API Calls
app.use("/api/**", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send("Unauthorized");
  }

  const user = req.user;
  const accessToken = user.accessToken;

  try {
    const response = await axios({
      method: req.method,
      url: `${RESOURCE_SERVER_URL}${req.originalUrl.replace("/api", "")}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...req.headers,
      },
      data: req.body,
    });

    // Send back the response from the resource server
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(
      "Error forwarding request to resource server:",
      error.response?.data || error.message
    );
    res
      .status(error.response?.status || 500)
      .send(error.response?.data || "Error forwarding request");
  }
});

app.get("/logout", async (req, res) => {
  const tokenRevocationURL = "https://ronaldjro.dev/auth/realms/KitchenCompanion/protocol/openid-connect/revoke";

  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const { accessToken, refreshToken } = req.user;

  console.log(process.env)

  try {
    // Revoke access token
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

    // Destroy session and clear cookies
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
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
        });

        res.status(200).json({ message: "Logged out successfully" });
      });
    });
  } catch (error) {
    console.error("Error revoking tokens:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to revoke tokens" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
