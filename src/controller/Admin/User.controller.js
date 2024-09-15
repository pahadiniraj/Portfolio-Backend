import { asyncHandler } from "../../utils/AsyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { User } from "../../models/user.model.js";

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshToken"); // Fetch all users excluding sensitive fields

  if (!users.length) {
    throw new ApiError(404, "No users found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

export { getUsers };
