import { Router } from "express";
import accessTokenAutoRefresh from "../middleware/accessTokenAutoRefresh.js";
import passport from "passport";
import { getUsers } from "../controller/Admin/User.controller.js";

const router = Router();

router
  .route("/get-users")
  .get(
    accessTokenAutoRefresh,
    passport.authenticate("jwt", { session: false }),
    getUsers
  );

export default router;
