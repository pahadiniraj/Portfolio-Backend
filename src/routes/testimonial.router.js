import { Router } from "express";
import accessTokenAutoRefresh from "../middleware/accessTokenAutoRefresh.js";
import passport from "passport";
import { UpdateTestimonial } from "../controller/Testimonial/CreateTestimonial.controller.js";
import { GetTestimonial } from "../controller/Testimonial/GetTestimonial.controller.js";
const router = Router();

router
  .route("/update-testimonial")
  .post(
    accessTokenAutoRefresh,
    passport.authenticate("jwt", { session: false }),
    UpdateTestimonial
  );

router.route("/get-testimonial").get(GetTestimonial);

export default router;
