import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  console.log("Request Files:", req.files);

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
  }
});

export { registerUser };
