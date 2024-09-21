import { Router } from "express";
import { validateRequest } from "../middleware/validateRequest.js";
import { createContact } from "../controller/Contact/CreateContact.controller.js";
import { createContactSchema } from "../helper/validator/contact.js";


const router = Router();
router
  .route("/contact-me")
  .post(validateRequest(createContactSchema), createContact);



export default router;
