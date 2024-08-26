import { User } from "../models/user.model.js";
import { generateAccessAndRefreshToken } from "../utils/AccessAndRefresh.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized access token");
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken?._id);

  if (!user) {
    throw new ApiError(403, "Invalid Refresh Token ");
  }

  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(403, "Token is expired");
  }

  const option = {
    httpOnly: true,
    secure: true,
  };

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshToken(user._id);

  user.refreshToken = newRefreshToken;
  await user.save();

  return res
    .status(200)
    .cookie("accessToken", newAccessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json({
      success: true,
      message: "Access Token refreshed successfully",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
});

export { refreshAccessToken };
