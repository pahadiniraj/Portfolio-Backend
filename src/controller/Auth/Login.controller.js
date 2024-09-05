import { User } from "../../models/user.model.js";
import { generateAccessAndRefreshToken } from "../../utils/AccessAndRefresh.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import setTokenCookies from "../../utils/setTokenCookies.js";

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new ApiError(
      404,
      "Looks like you're new here. Please create an account to continue"
    );
  }

  if (!user.isVerified) {
    throw new ApiError(400, "Buddy you are not verified yet.");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(
      401,
      "Your password seems to be playing hide and seek. Let’s find it together, try again!"
    );
  }

  // generate access token and set in cookie

  const { refreshToken, accessToken, accessTokenExp, refreshTokenExp } =
    await generateAccessAndRefreshToken(user);

  // set cookie

  setTokenCookies(
    res,
    refreshToken,
    accessToken,
    accessTokenExp,
    refreshTokenExp
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

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
});

export { loginUser };
