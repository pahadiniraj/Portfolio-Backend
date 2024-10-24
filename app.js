import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv, { config } from "dotenv";
import "./src/utils/passport-jwt-stragegy.js";

const app = express();

dotenv.config({
  path: "./.env",
});

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CROSS_ORIGIN, // Replace with your frontend URL
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

checkAndDeleteUnverifiedUsers();

//google auth
import googleAuth from "./src/routes/google.router.js";

app.use("", googleAuth);

// User router

import userRouter from "./src/routes/user.routes.js";

app.use("/api/users", userRouter);

// auth router

import authRouter from "./src/routes/auth.router.js";
app.use("/api/auth", authRouter);

// admin router

import adminRouter from "./src/routes/admin.router.js";
import checkAndDeleteUnverifiedUsers from "./src/utils/cornJob.js";

app.use("/api/admin", adminRouter);

// contact router

import contactRoute from "./src/routes/contact.router.js";
app.use("/api/contact", contactRoute);

// testimonial routes

import testimonialRoute from "./src/routes/testimonial.router.js";
app.use("/api/testimonial", testimonialRoute);

import projectRoutes from "./src/routes/project.router.js";
app.use("/api/projects", projectRoutes);

export { app };
// /*  */