import { User } from "../models/user.model.js";
import { UserRefreshToken } from "../models/userRefreshToken.model.js";
import { generateAccessAndRefreshToken } from "../utils/AccessAndRefresh.js";
import { ApiError } from "../utils/ApiError.js";
import isTokenExpired from "../utils/isTokenExpired.js";
import setTokenCookies from "../utils/setTokenCookies.js";
import verifyRefreshToken from "../utils/verifyRefreshToken.js";
import jwt from "jsonwebtoken";

const accessTokenAutoRefresh = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (accessToken || !isTokenExpired(accessToken)) {
      req.headers["authorization"] = `Bearer ${accessToken}`;
    }

    if (!accessToken || isTokenExpired(accessToken)) {
      const oldRefreshToken = req.cookies.refreshToken;

      if (!oldRefreshToken) {
        throw new ApiError(400, "Refresh token is missing ");
      }
      console.log("old refresh token", oldRefreshToken);

      const { tokenDetails } = await verifyRefreshToken(oldRefreshToken);

      const user = await User.findById(tokenDetails._id);
      if (!user) {
        throw new ApiError(404, "User not found");
        // return res.status(404).json({ error: "User not found" });
      }

      const userRefToken = await UserRefreshToken.findOne({
        userId: tokenDetails._id,
      });

      if (oldRefreshToken !== userRefToken.token) {
        // return res.status(401).json({ error: "Invalid refresh token" });
        throw new ApiError(401, "Unauthorized access");
      }

      const payload = {
        _id: user._id,
        roles: user.roles,
      };

      const newRefreshTokenExp = tokenDetails.exp;

      const newAccessTokenExp = Math.floor(Date.now() / 1000) + 100;
      const newAccessToken = jwt.sign(
        { ...payload, exp: newAccessTokenExp },
        process.env.ACCESS_TOKEN_SECRET
      );

      setTokenCookies(
        res,
        newAccessToken,
        newAccessTokenExp,
        oldRefreshToken,
        newRefreshTokenExp,
        user.isVerified,
        user.role
      );

      req.headers["authorization"] = `Bearer ${newAccessToken}`;
    }

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
    // return res.status(500).json({ error: "Internal server error" });
  }
};
export default accessTokenAutoRefresh;
