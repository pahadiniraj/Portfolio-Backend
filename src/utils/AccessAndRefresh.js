import { User } from "../models/user.model.js";
import { ApiError } from "./ApiError.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({
      validateBeforeSave: false,
    });
    console.log("Tokens are here " + accessToken, refreshToken);
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Somthing went wrong while generating access and refresh token "
    );
  }
};

export { generateAccessAndRefreshToken };
