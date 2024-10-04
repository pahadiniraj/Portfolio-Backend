import { Router } from "express";
import accessTokenAutoRefresh from "../middleware/accessTokenAutoRefresh.js";
import passport from "passport";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { createProject } from "../controller/Admin/Project/CreateProject.conteoller.js";
import { upload } from "../middleware/multer.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { projectSchema } from "../helper/validator/Project.js";
import { getAllProjects } from "../controller/User/getAllProject.controller.js";

const router = Router();

router.route("/create-project").post(
  accessTokenAutoRefresh,
  passport.authenticate("jwt", { session: false }),
  // validateRequest(projectSchema),
  adminMiddleware,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  createProject
);

router.route("/get-all-Projects").get(getAllProjects);

export default router;

