import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getUsers } from "../controller/User/User.controller.js";
import { getUserProfile } from "../controller/User/getUserProfile.controller.js";
import passport from "passport";
import accessTokenAutoRefresh from "../middleware/accessTokenAutoRefresh.js";
import { logoutUser } from "../controller/User/logoutUser.js";

const router = Router();

router
  .route("/get-users")
  .get(
    accessTokenAutoRefresh,
    passport.authenticate("jwt", { session: false }),
    getUsers
  );
router
  .route("/get-profile")
  .get(
    accessTokenAutoRefresh,
    passport.authenticate("jwt", { session: false }),
    getUserProfile
  );

router
  .route("/logout")
  .post(
    accessTokenAutoRefresh,
    passport.authenticate("jwt", { session: false }),
    logoutUser
  );

export default router;
