import { Router } from "express";
import { registerUser } from "../controller/Auth/Register.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  loginSchema,
  registerSchema,
} from "../helper/validator/loginAndRegister.js";
import { loginUser } from "../controller/Auth/Login.controller.js";
import { verifyOtpSchema } from "../helper/validator/OtpSchema.js";
import { passwordResetEmail } from "../controller/Email/passwordResetEmail.controller.js";
import { passwordReset } from "../controller/Email/passwordReset.controller.js";
import {
  passwordResetEmailLinkSchema,
  passwordResetSchema,
} from "../helper/validator/passwordReset.js";
import { VerifyOtp } from "../controller/Auth/verifyOtp.controller.js";
import { logoutUser } from "../controller/User/logoutUser.js";
import accessTokenAutoRefresh from "../middleware/accessTokenAutoRefresh.js";
import passport from "passport";

const router = Router();

router.route("/register").post(validateRequest(registerSchema), registerUser);
router.route("/login").post(validateRequest(loginSchema), loginUser);

// logout
router
  .route("/logout")
  .post(
    accessTokenAutoRefresh,
    passport.authenticate("jwt", { session: false }),
    logoutUser
  );

// otp auth
router.route("/verify-otp").post(validateRequest(verifyOtpSchema), VerifyOtp);

// reset password
router
  .route("/reset-password-link")
  .post(validateRequest(passwordResetEmailLinkSchema), passwordResetEmail);
router
  .route("/reset-password-confirm/:id/:token")
  .post(validateRequest(passwordResetSchema), passwordReset);

export default router;
