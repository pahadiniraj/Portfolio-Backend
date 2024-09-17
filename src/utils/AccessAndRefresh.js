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

    const refreshTokenExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5;
    const refreshToken = jwt.sign(
      { ...payload, exp: refreshTokenExp },
      process.env.REFRESH_TOKEN_SECRET
    );

    const userRefreshToken = await UserRefreshToken.findOne({
      userId: user._id,
    });

    if (userRefreshToken) {
      await UserRefreshToken.findOneAndDelete({ userId: user._id });
    }

    await new UserRefreshToken({
      userId: user._id,
      token: refreshToken,
    }).save();

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
      "Somthing went wrong while generating access and refresh token "
    );
  }
};

export { generateAccessAndRefreshToken };
