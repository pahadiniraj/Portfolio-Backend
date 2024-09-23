import mongoose from "mongoose";
import { User } from "../../../models/user.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/AsyncHandler.js";

const DeleteAllUsers = asyncHandler(async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    throw new ApiError(400, "Id is not Provided");
  }
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw new ApiError(400, "Invalid ID format");
  }
  const user = await User.findById(_id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  await User.findByIdAndDelete(user._id);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
        `${user.firstName} has been removed from Database`
      )
    );
});

export { DeleteAllUsers };
