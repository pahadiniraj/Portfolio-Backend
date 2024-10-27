// updateUserAvatar.js
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import {
  deleteFromCloudinary,
  extractPublicIdFromUrl,
  uploadOnCloudinary,
} from "../../utils/cloudinary.js";

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarBuffer = req.file?.buffer;

  if (!avatarBuffer) {
    throw new ApiError(400, "Avatar file is missing");
  }

  // Upload avatar using buffer
  const avatar = await uploadOnCloudinary(avatarBuffer);
  if (!avatar) {
    throw new ApiError(500, "Error occurred while uploading avatar");
  }

  // Fetch the user first
  const user = await User.findById(req.user._id).select("avatar");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if there is a previous avatar and delete it
  if (user.avatar) {
    const publicId = extractPublicIdFromUrl(user.avatar);
    await deleteFromCloudinary(publicId);
  }

  // Update user with the new avatar URL
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar } },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Avatar updated successfully"));
});

export { updateUserAvatar };
