import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import bcrypt from "bcryptjs";

const changeUserPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, newConfirmPassword } = req.body;

  if (newPassword !== newConfirmPassword) {
    throw new ApiError(400, "New passwords do not match");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw new ApiError(400, "Current password is incorrect");
  }

  const isSameAsOldPassword = await bcrypt.compare(newPassword, user.password);
  if (isSameAsOldPassword) {
    throw new ApiError(
      400,
      "New password cannot be the same as the old password"
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await User.findByIdAndUpdate(req.user._id, {
    $set: { password: hashedPassword },
  });

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
