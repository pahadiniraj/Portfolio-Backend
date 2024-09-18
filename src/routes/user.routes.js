import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getUsers } from "../controller/Admin/User.controller.js";
import { getUserProfile } from "../controller/User/getUserProfile.controller.js";
import passport from "passport";
import accessTokenAutoRefresh from "../middleware/accessTokenAutoRefresh.js";
import { changeUserPassword } from "../controller/User/changeUserPassword.controller.js";
import { updateUserProfile } from "../controller/User/updateUserProfile.controller.js";

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
  .route("/change-password")
  .post(
    accessTokenAutoRefresh,
    passport.authenticate("jwt", { session: false }),
    changeUserPassword
  );

router
  .route("/update-user-profile")
  .post(
    accessTokenAutoRefresh,
    passport.authenticate("jwt", { session: false }),
    updateUserProfile
  );

export default router;


