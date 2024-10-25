import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import "./src/utils/passport-jwt-stragegy.js";
import checkAndDeleteUnverifiedUsers from "./src/utils/cornJob.js"; // Ensure this path is correct

const app = express();

dotenv.config({
  path: "./.env",
});

// Middleware
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "https://nirajpahadi.com.np",
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Check and delete unverified users periodically
checkAndDeleteUnverifiedUsers();

// Routes
import googleAuth from "./src/routes/google.router.js";
import userRouter from "./src/routes/user.routes.js";
import authRouter from "./src/routes/auth.router.js";
import adminRouter from "./src/routes/admin.router.js";
import contactRoute from "./src/routes/contact.router.js";
import testimonialRoute from "./src/routes/testimonial.router.js";
import projectRoutes from "./src/routes/project.router.js";

app.use("", googleAuth);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/contact", contactRoute);
app.use("/api/testimonial", testimonialRoute);
app.use("/api/projects", projectRoutes);

// Define a root route
app.get("/", (req, res) => {
  res.send("Hello, World! I'm Niraj!");
});

// Export the app instance
export default app;
