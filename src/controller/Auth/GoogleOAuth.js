import axios from "axios";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { User } from "../../models/user.model.js";
import { generateAccessAndRefreshToken } from "../../utils/AccessAndRefresh.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { oauth2client } from "../../utils/googleConfig.js";
import setTokenCookies from "../../utils/setTokenCookies.js";
import { ApiError } from "../../utils/ApiError.js";

const googleLogin = asyncHandler(async (req, res) => {
  const { code } = req.query;
  console.log(code);
  if (!code) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Missing authorization code"));
  }

  try {
    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${googleRes.tokens.access_token}`
    );

    const { sub, email, given_name, family_name, picture } = userRes.data;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        googleId: sub,
        firstName: given_name,
        lastName: family_name,
        email: email,
        avatar: picture,
      });
    }

    // const tokens = jwt.sign(
    //   { _id, email },

    //   process.env.ACCESS_TOKEN_SECRET,
    //   {
    //     expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    //   }
    // );

    const { accessToken, accessTokenExp, refreshToken, refreshTokenExp } =
      await generateAccessAndRefreshToken(user);

    setTokenCookies(
      res,
      accessToken,
      accessTokenExp,
      refreshToken,
      refreshTokenExp
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          roles: user.roles,
          accessToken,
          refreshToken,
          accessTokenExp,
          isVerifies: user.isVerified,
        },
        `Hey ${user.firstName} ! Welcome to my corner of the internet! Now you can like,comment and share my post.`
      )
    );
  } catch (error) {
    console.error(error);
    throw new ApiError(400, "Error while logging in");
  }
});

export { googleLogin };
