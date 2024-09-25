import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getUserProfile } from "../controller/User/getUserProfile.controller.js";
import passport from "passport";
import accessTokenAutoRefresh from "../middleware/accessTokenAutoRefresh.js";
import { changeUserPassword } from "../controller/User/changeUserPassword.controller.js";
import { updateUserProfile } from "../controller/User/updateUserProfile.controller.js";
import { deleteAccount } from "../controller/User/deleteAccount.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { DeleteAccountSchema } from "../helper/validator/DeleteAccount.js";
import { upload } from "../middleware/multer.js";
import { updateUserAvatar } from "../controller/User/updateAvatar.controller.js";

const router = Router();

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

router
  .route("/delete-account/:id")
  .post(
    validateRequest(DeleteAccountSchema),
    accessTokenAutoRefresh,
    passport.authenticate("jwt", { session: false }),
    deleteAccount
  );

router
  .route("/update-user-avatar")
  .post(
    accessTokenAutoRefresh,
    upload.single("avatar"),
    passport.authenticate("jwt", { session: false }),
    updateUserAvatar
  );

export default router;
