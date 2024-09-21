import { Router } from "express";
import accessTokenAutoRefresh from "../middleware/accessTokenAutoRefresh.js";
import passport from "passport";
import { getUsers } from "../controller/Admin/User.controller.js";
import { getAllContact } from "../controller/Admin/Contact/GetAllContact.controller.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { UpdateContact } from "../controller/Admin/Contact/UpdateContact.controller.js";
import { DeleteContact } from "../controller/Admin/Contact/DeleteContact.controller.js";

const router = Router();

router
  .route("/get-users")
  .get(
    accessTokenAutoRefresh,
    passport.authenticate("jwt", { session: false }),
    adminMiddleware,
    getUsers
  );

router
  .route("/get-contact")
  .get(
    accessTokenAutoRefresh,
    passport.authenticate("jwt", { session: false }),
    adminMiddleware,
    getAllContact
  );

router
  .route("/update-contact")
  .put(
    accessTokenAutoRefresh,
    passport.authenticate("jwt", { session: false }),
    adminMiddleware,
    UpdateContact
  );

router
  .route("/delete-contact")
  .delete(
    accessTokenAutoRefresh,
    passport.authenticate("jwt", { session: false }),
    adminMiddleware,
    DeleteContact
  );

export default router;
