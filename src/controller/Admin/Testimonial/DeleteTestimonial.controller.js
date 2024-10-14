import { Testimonial } from "../../../models/testimonial.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/AsyncHandler.js";

const DeleteTestimonial = asyncHandler(async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    throw new ApiError(400, "Id is Required");
  }

  const testimonial = await Testimonial.findByIdAndDelete(_id).populate(
    "user",
    "firstName"
  );

  if (!testimonial) {
    throw new ApiError(404, "Testimonial not found");
  }

  const userFirstName = testimonial.user?.firstName || "Unknown User";

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        testimonial,
        `Testimonial by ${userFirstName} deleted successfully`
      )
    );
});

export { DeleteTestimonial };
