import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getUsers } from "../controller/User/User.controller.js";

const router = Router();

router.route("/get-users").get(verifyToken, getUsers);

export default router;
