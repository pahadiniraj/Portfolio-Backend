import { EmailVerification } from "../../models/emailVerification.model.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import generateOtpAndSendMail from "../Email/generateOtp.controller.js";

const VerifyOtp = asyncHandler(async (req, res) => {
  const email = req.cookies.email;

  const { otp } = req.body;

  if (!email) {
    throw new ApiError(401, "Token hase been expired ");
  }

  // Find user by email
  const userExist = await User.findOne({ email });

  // If user does not exist, throw error
  if (!userExist) {
    throw new ApiError(
      404,
      "Buddy! please register you are not in my database"
    );
  }

  // If user is already verified, throw error
  if (userExist.isVerified) {
    throw new ApiError(400, "User already verified");
  }

  // Find the OTP entry for the user
  const emailVerification = await EmailVerification.findOne({
    userId: userExist._id,
    otp,
  });

  // If OTP is not found, resend a new OTP and throw error
  if (!emailVerification) {
    await generateOtpAndSendMail(req, userExist);
    throw new ApiError(
      400,
      "Invalid OTP. A new OTP has been sent to your email."
    );
  }

  // Calculate expiration time (15 minutes from OTP creation)
  const currentTime = new Date();
  const expirationTime = new Date(
    emailVerification.createdAt.getTime() + 15 * 60 * 1000
  );

  // If OTP is expired, resend a new OTP and throw error
  if (currentTime > expirationTime) {
    await generateOtpAndSendMail(req, userExist);
    throw new ApiError(
      400,
      "OTP expired. A new OTP has been sent to your email."
    );
  }

  // Mark user as verified
  userExist.isVerified = true;
  const user = await userExist.save();

  // Delete all OTP entries for this user
  await EmailVerification.deleteMany({ userId: userExist._id });

  // Send success response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
        `Welcome ${userExist.firstName}, your email has been verified successfully.`
      )
    );
});

export { VerifyOtp };
