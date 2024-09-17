import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import bcrypt from "bcrypt";

const changeUserPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, newConfirmPassword } = req.body;

  // Check if the new passwords match
  if (newPassword !== newConfirmPassword) {
    throw new ApiError(400, "New passwords do not match");
  }

  // Find the user by ID
  const user = await User.findById(req.user._id);

  // Check if user exists
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Compare the current password with the stored password
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  // If the current password doesn't match, throw an error
  if (!isMatch) {
    throw new ApiError(400, "Current password is incorrect");
  }

  // Check if the new password is the same as the old password
  const isSameAsOldPassword = await bcrypt.compare(newPassword, user.password);
  if (isSameAsOldPassword) {
    throw new ApiError(
      400,
      "New password cannot be the same as the old password"
    );
  }

  // Hash the new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update the user's password
  await User.findByIdAndUpdate(req.user._id, {
    $set: { password: hashedPassword },
  });

  // Send success response
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        `${user.firstName} your password has been updated successfully`
      )
    );
});

export { changeUserPassword };
