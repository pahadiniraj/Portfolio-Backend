import { Testimonial } from "../../models/testimonial.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";

const getAllTestimonial = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find().populate(
    "user",
    "firstName lastName jobTitle"
  );
  res
    .status(200)
    .json(
      new ApiResponse(200, testimonials, "Testimonials fetched sucessfully")
    );
});

export { getAllTestimonial };
