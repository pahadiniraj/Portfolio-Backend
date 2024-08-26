import { Router } from "express";
import { registerUser } from "../controller/User/Register.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { registerSchema } from "../helper/validator/loginAndRegister.js";

const router = Router();

router.route("/register").post(validateRequest(registerSchema),registerUser);

export default router;
