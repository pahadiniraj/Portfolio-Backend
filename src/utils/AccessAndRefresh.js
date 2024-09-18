import { UserRefreshToken } from "../models/userRefreshToken.model.js";
import { ApiError } from "./ApiError.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (user) => {
  try {
    const payload = {
      _id: user._id,
      roles: user.roles,
    };

    const accessTokenExp = Math.floor(Date.now() / 1000) + 100;
    const accessToken = jwt.sign(
      { ...payload, exp: accessTokenExp },
      process.env.ACCESS_TOKEN_SECRET
    );

    // Check if refresh token exists
    let refreshToken, refreshTokenExp;

    const userRefreshToken = await UserRefreshToken.findOne({
      userId: user._id,
    });

    if (userRefreshToken) {
      // Verify if the refresh token has expired
      const decoded = jwt.decode(userRefreshToken.token);

      if (decoded && decoded.exp > Math.floor(Date.now() / 1000)) {
        // If token is still valid, reuse it
        refreshToken = userRefreshToken.token;
        refreshTokenExp = decoded.exp;
      } else {
        // If token has expired, generate a new one
        refreshTokenExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5; // 5 days expiry
        refreshToken = jwt.sign(
          { ...payload, exp: refreshTokenExp },
          process.env.REFRESH_TOKEN_SECRET
        );
        // Update the token in the database
        userRefreshToken.token = refreshToken;
        await userRefreshToken.save();
      }
    } else {
      // If no token found, create a new one
      refreshTokenExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5; // 5 days expiry
      refreshToken = jwt.sign(
        { ...payload, exp: refreshTokenExp },
        process.env.REFRESH_TOKEN_SECRET
      );

      // Save new refresh token to the database
      await new UserRefreshToken({
        userId: user._id,
        token: refreshToken,
      }).save();
    }

    return Promise.resolve({
      accessToken,
      accessTokenExp,
      refreshToken,
      refreshTokenExp,
      isVerified: user.isVerified,
      role: user.role,
    });
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

export { generateAccessAndRefreshToken };
