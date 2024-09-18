import { UserRefreshToken } from "../models/userRefreshToken.model.js";
import { ApiError } from "./ApiError.js";
import jwt from "jsonwebtoken";

const verifyRefreshToken = async (oldRefreshToken) => {
  const privateKey = process.env.REFRESH_TOKEN_SECRET;
  try {
    // Find the refreshToken in the database
    const userRefreshToken = await UserRefreshToken.findOne({
      token: oldRefreshToken,
    });

    console.log(userRefreshToken);
    // If refresh token is not found, reject with an error
    if (!userRefreshToken) {
      throw new ApiError(400, "Invalid refresh token what");
    }

    // Verify the refresh token
    const tokenDetails = jwt.verify(oldRefreshToken, privateKey);

    return {
      tokenDetails,
      error: false,
      message: "Refresh token is valid",
    };
  } catch (error) {
    throw { error: true, message: error.message };
  }
};

export default verifyRefreshToken;
