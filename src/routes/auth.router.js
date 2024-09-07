import { Router } from "express";
import { registerUser } from "../controller/Auth/Register.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  loginSchema,
  registerSchema,
} from "../helper/validator/loginAndRegister.js";
import { loginUser } from "../controller/Auth/Login.controller.js";
import { googleLogin } from "../controller/Auth/GoogleOAuth.js";
import { verifyOtpSchema } from "../helper/validator/OtpSchema.js";
import { verifyEmailWithOtp } from "../controller/Email/verifyEmail.controller.js";

const router = Router();

router.route("/register").post(validateRequest(registerSchema), registerUser);
router.route("/login").post(validateRequest(loginSchema), loginUser);

// google authentication

router.route("/google").get(googleLogin);

// otp auth
router
  .route("/verify-email")
  .post(validateRequest(verifyOtpSchema), verifyEmailWithOtp);

// token refresh

export default router;
