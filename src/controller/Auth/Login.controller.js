import { User } from "../../models/user.model.js";
import { generateAccessAndRefreshToken } from "../../utils/AccessAndRefresh.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import setTokenCookies from "../../utils/setTokenCookies.js";

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

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

  // Generate access token and refresh token
  const { refreshToken, accessToken, accessTokenExp, refreshTokenExp } =
    await generateAccessAndRefreshToken(user);

  // Set cookies
  setTokenCookies(
    res,
    accessToken,
    accessTokenExp,
    refreshToken,
    refreshTokenExp,
    user.isVerified,
    user.role
  );

  // Custom message based on email
  const customMessage =
    email === "sharma12345niraj@gmail.com"
      ? "Welcome back, BOSS ! "
      : `Hey ${user.firstName}! Welcome to my corner of the internet! Now you can like, comment, and share my post.`;

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
        isVerified: user.isVerified,
      },
      customMessage
    )
  );
});

export { loginUser };
