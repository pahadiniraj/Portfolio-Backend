import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";

const getUserProfileById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const profile = await User.findById(id).select("-password -role -isVerified");
  if (!profile) {
    throw new ApiError("User not found");
  }
  res.status(200).json(new ApiResponse(200, profile, "User Found"));
});
export { getUserProfileById };
