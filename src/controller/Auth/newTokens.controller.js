import { asyncHandler } from "../../utils/AsyncHandler.js";
import setTokenCookies from "../../utils/setTokenCookies.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import verifyRefreshToken from "../../utils/verifyRefreshToken.js";
import { User } from "../../models/user.model.js";
import { UserRefreshToken } from "../../models/userRefreshToken.model.js";
import { generateAccessAndRefreshToken } from "../../utils/AccessAndRefresh.js";
import { ApiError } from "../../utils/ApiError.js";

const newTokens = asyncHandler(async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;
  if (!oldRefreshToken) {
    throw new ApiError(400, "Refresh token is missing");
    // return res.status(400).json({ error: "Refresh token is missing" });
  }
  console.log(oldRefreshToken);
  const { tokenDetails } = await verifyRefreshToken(oldRefreshToken);

  console.log("token details", tokenDetails);

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
    throw new ApiError(401, "Invalid refresh token");
  }

  const {
    accessToken: newAccessToken,
    accessTokenExp: newAccessTokenExp,
    refreshToken: newRefreshToken,
    refreshTokenExp: newRefreshTokenExp,
  } = await generateAccessAndRefreshToken(user);

  setTokenCookies(
    res,
    newAccessToken,
    newAccessTokenExp,
    newRefreshToken,
    newRefreshTokenExp
  );

  res.status(200).json(
    new ApiResponse(
      200,
      {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
      "Tokens refreshed successfully"
    )
  );
});

export { newTokens };
