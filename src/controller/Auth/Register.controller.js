import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import generateOtpAndSendMail from "../Email/generateOtp.controller.js";

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const existedUser = await User.findOne({
    email,
  });

  if (existedUser) {
    throw new ApiError(409, "Username or email already exists ");
  }

  const { avatar, coverImage } = req.files || {};
  const avatarFile = avatar?.[0];
  const coverImageFile = coverImage?.[0];

  let avatarUrl = null;
  if (avatarFile) {
    const avatarLocalPath = avatarFile.path;
    avatarUrl = await uploadOnCloudinary(avatarLocalPath);
    if (!avatarUrl) {
      throw new ApiError(500, "Error occured while uploading avatar");
    }
  }

  let coverImageUrl = null;
  if (coverImageFile) {
    const coverImageLocalPath = coverImageFile.path;
    coverImageUrl = await uploadOnCloudinary(coverImageLocalPath);
    if (!coverImageUrl) {
      throw new ApiError(500, "Error occured while uploading cover image");
    }
  }

  // Continue with the rest of the user registration logic

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    avatar: avatarUrl || "",
    coverImage: coverImageUrl || "",
  });

  console.log(user);

  generateOtpAndSendMail(req, user);

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Somthing went wrong while registering user");
  }
  console.log("User Created");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        createdUser,
        `${createdUser.firstName}, you have been registered in my Portfolio account Feel free to Like and Comment  `
      )
    );
});

export { registerUser };
