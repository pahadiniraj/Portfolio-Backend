import { Router } from "express";
import accessTokenAutoRefresh from "../middleware/accessTokenAutoRefresh.js";
import passport from "passport";
import { UpdateTestimonial } from "../controller/Testimonial/CreateTestimonial.controller.js";

const router = Router();

router
  .route("/update-testimonial")
  .post(
    accessTokenAutoRefresh,
    passport.authenticate("jwt", { session: false }),
    UpdateTestimonial
  );

export default router;
