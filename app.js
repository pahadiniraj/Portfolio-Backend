import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

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

// User router

import userRouter from "./src/routes/user.routes.js";

app.use("/api/users", userRouter);

// auth router

import authRouter from "./src/routes/auth.router.js";
app.use("/api/auth", authRouter);

export { app };
