import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";

// Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  // Check if the user is authenticated
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  // Get user ID from `req.user` and find the user
  const user = await User.findById(req.user._id);

  // If user not found, return error
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Update the user's profile fields (check if provided, otherwise keep the old value)

  user.bio = req.body.bio || "";
  user.jobTitle = req.body.jobTitle || "";
  user.socialLinks.instagram = req.body.instagram || "";
  user.socialLinks.twitter = req.body.twitter || "";
  user.socialLinks.linkedin = req.body.linkedin || "";
  user.socialLinks.github = req.body.github || "";
  user.socialLinks.personalWebsite = req.body.personalWebsite || "";
  user.socialLinks.facebook = req.body.facebook || "";
  user.socialLinks.youtube = req.body.youtube || "";

  // Save the updated user data to the database
  const newUser = await user.save();

  // Respond with the updated user information

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        newUser,
        `${user.firstName} your profile has been updated`
      )
    );
});

export { updateUserProfile };
