import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";

const deleteAccount = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(200, "User not found");
  }
  if (user.email === "sharma12345niraj@gmail.com") {
    throw new ApiError(200, "I need you bro! ");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(200, "Sorry you can't remove this account");
  }

  const UserData = await User.findByIdAndDelete(user.id);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        UserData,
        `${UserData.firstName} your account has been Permanently removed`
      )
    );
});

export { deleteAccount };
