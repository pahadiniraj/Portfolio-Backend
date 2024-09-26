import { Router } from "express";
import accessTokenAutoRefresh from "../middleware/accessTokenAutoRefresh.js";
import passport from "passport";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

import { createProject } from "../controller/Admin/Project/CreateProject.conteoller.js";
import { upload } from "../middleware/multer.js";

const router = Router();

router.route("/create-project").post(
  accessTokenAutoRefresh,
  upload.array("images"),
  passport.authenticate("jwt", { session: false }),
  // adminMiddleware,
  createProject
);

export default router;
