const express = require("express");
const passport = require("passport");
const OAuth2Strategy = require("passport-oauth2");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const axios = require("axios");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

// OAuth Configuration
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
    },
    (accessToken, refreshToken, profile, done) => {
      const user = { accessToken, refreshToken, profile };
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/login",
  passport.authenticate("oauth2", {
    scope: ["profile"],
  })
);

app.get(
  "/callback",
  passport.authenticate("oauth2", { failureRedirect: "/login" }),
  (req, res) => {
    // Redirect to the frontend after successful login
    res.redirect(process.env.FRONTEND_URL); // Update with your Vite frontend URL
  }
);

// Proxy Middleware for All API Calls
app.use("/api", async (req, res) => {
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
    console.error("Error forwarding request to resource server:", error.response?.data || error.message);
    res.status(error.response?.status || 500).send(error.response?.data || "Error forwarding request");
  }
});

// Route: Logout
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    res.clearCookie("connect.sid");
    res.send("Logged out");
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
