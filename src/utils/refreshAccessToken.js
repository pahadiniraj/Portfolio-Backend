// import { User } from "../models/user.model.js";
// import { UserRefreshToken } from "../models/userRefreshToken.model.js";
// import { generateAccessAndRefreshToken } from "./AccessAndRefresh.js";
// import verifyRefreshToken from "./verifyRefreshToken.js";

// const refreshAccessToken = async (req, res) => {
//   try {
//     const oldRefreshToken = req.cookies.refreshToken;
//     if (!oldRefreshToken) {
//       return res.status(400).json({ error: "Refresh token is missing" });
//     }

//     // Verify that the refresh token is valid
//     const { tokenDetails } = await verifyRefreshToken(oldRefreshToken);

//     // Find the user based on the refresh token
//     const user = await User.findById(tokenDetails._id);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const userRefToken = await UserRefreshToken.findOne({
//       userId: tokenDetails._id,
//     });

//     // Check if the refresh token is valid and not blacklisted
//     if (oldRefreshToken !== userRefToken.token || userRefToken.blacklisted) {
//       return res.status(401).json({ error: "Invalid refresh token" });
//     }

//     // Generate new access and refresh tokens
//     const { accessToken, accessTokenExp, refreshToken, refreshTokenExp } =
//       await generateAccessAndRefreshToken(user);

//     // Return the new tokens in the response body
//     return res.status(200).json({
//       newAccessToken: accessToken,
//       newAccessTokenExp: accessTokenExp,
//       newRefreshToken: refreshToken,
//       newRefreshTokenExp: refreshTokenExp,
//     });
//   } catch (error) {
//     // Handle any error and send a proper response
//     throw error;
//   }
// };

// export default refreshAccessToken;
