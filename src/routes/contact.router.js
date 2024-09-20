import { Router } from "express";
import { validateRequest } from "../middleware/validateRequest.js";
import { createContact } from "../controller/Contact/CreateContact.controller.js";
import { createContactSchema } from "../helper/validator/contact.js";
import accessTokenAutoRefresh from "../middleware/accessTokenAutoRefresh.js";
import passport from "passport";
import { getAllContact } from "../controller/Admin/Contact/GetAllContact.controller.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = Router();
router
  .route("/contact-me")
  .post(validateRequest(createContactSchema), createContact);

router
  .route("/get-contact")
  .get(
    accessTokenAutoRefresh,
    passport.authenticate("jwt", { session: false }),
    adminMiddleware,
    getAllContact
  );

export default router;
