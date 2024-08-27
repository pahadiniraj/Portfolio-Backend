import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { configureGoogleOAuth } from "./src/controller/Auth/GoogleOAuth.js";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: `${process.env.CROSS_ORIGIN}`, // Replace with your frontend URL
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(express.static("public"));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

configureGoogleOAuth();
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth router
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000",
    failureRedirect: "http://localhost:3000/login",
  })
);


// User router

// auth router

import authRouter from "./src/routes/auth.router.js";
app.use("/api/auth", authRouter);

export { app };
