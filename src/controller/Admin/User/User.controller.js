import { asyncHandler } from "../../../utils/AsyncHandler.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { User } from "../../../models/user.model.js";
import { ApiError } from "../../../utils/ApiError.js";

const getUsers = asyncHandler(async (req, res) => {
  // Fetch all users excluding sensitive fields and filtering out admin users
  const users = await User.find({ role: { $ne: "admin" } }).select(
    "-password -refreshToken"
  );

  if (!users.length) {
    throw new ApiError(404, "No users found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

export { getUsers };
