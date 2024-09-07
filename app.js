import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv, { config } from "dotenv";
import "./src/utils/passport-jwt-stragegy.js";

const app = express();

dotenv.config({
  path: "./.env",
});

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
    limit: "16kb",
  })
);

app.use(express.static("public"));
app.use(cookieParser());

// User router

import userRouter from "./src/routes/user.routes.js";

app.use("/api/users", userRouter);

// auth router

import authRouter from "./src/routes/auth.router.js";
app.use("/api/auth", authRouter);

// admin router

import adminRouter from "./src/routes/admin.router.js";

app.use("/api/admin", adminRouter);

export { app };
