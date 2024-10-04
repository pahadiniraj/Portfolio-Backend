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
  const avatarLocalPath = req.file?.path;
  console.log(avatarLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  console.log(avatar);

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
    const publicId = extractPublicIdFromUrl(user.avatar); // Extract the public ID from the URL
    await deleteFromCloudinary(publicId); // Delete the previous avatar
  }

  // Update user with the new avatar URL
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Avatar updated successfully"));
});

export { updateUserAvatar };
