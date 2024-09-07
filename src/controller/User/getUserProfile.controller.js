import { asyncHandler } from "../../utils/AsyncHandler.js";

const getUserProfile = asyncHandler(async (req, res) => {
  res.send({ user: req.user });
});

export { getUserProfile };
