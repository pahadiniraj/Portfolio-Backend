import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ApiResponse } from "../../utils/ApiResponse.js";

const passwordReset = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    const { id, token } = req.params;

    if (!password || !confirmPassword) {
      throw new ApiError(
        400,
        "Please provide the password and confirm password"
      );
    }
    if (password !== confirmPassword) {
      throw new ApiError(400, "Passwords do not match");
    }

    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(400, "User not found");
    }

    const newSecret = user._id + process.env.ACCESS_TOKEN_SECRET;
    jwt.verify(token, newSecret);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.findByIdAndUpdate(user._id, {
      $set: { password: hashedPassword },
    });

    res.status(200).json(new ApiResponse(200, "Password reset successfully"));
  } catch (error) {
    console.error(error);
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({
        status: "failed",
        message: "Time up,please request a new password reset link",
      });
    }
    return res.status(500).json({
      status: "failed",
      message: "Unable to reset password, Please try again later",
    });
  }
};

export { passwordReset };
