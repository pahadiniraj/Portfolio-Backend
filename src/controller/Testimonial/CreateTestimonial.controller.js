import { Testimonial } from "../../models/testimonial.model.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";

const UpdateTestimonial = asyncHandler(async (req, res) => {
  const { rating, message } = req.body;

  const userId = req.user._id;

  // Check if the required fields are present
  if (rating === undefined || !message) {
    // Changed to `rating === undefined` to properly check for a value of 0
    throw new ApiError(400, "Rating and message are required");
  }

  // Find the user
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Find the existing testimonial
  let testimonial = await Testimonial.findOne({ user: userId });

  if (testimonial) {
    // Update the existing testimonial
    testimonial.rating = rating;
    testimonial.message = message;
    await testimonial.save();

    // Send a success response
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          testimonial,
          `${user.firstName}, your testimonial has been updated successfully.`
        )
      );
  } else {
    // Create a new testimonial if one does not exist
    testimonial = await Testimonial.create({
      user: userId,
      rating,
      message,
    });

    // Send a success response
    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          testimonial,
          `${user.firstName}, you have successfully created a new testimonial.`
        )
      );
  }
});

export { UpdateTestimonial };
