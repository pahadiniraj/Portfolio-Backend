import { asyncHandler } from "../../utils/AsyncHandler.js";

// Ensure `req.user` contains the user information after authentication
const getUserProfile = asyncHandler(async (req, res) => {
  // Check if user is available on req object
  if (!req.user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Destructure social links from the user's `socialLinks` object
  const {
    instagram,
    twitter,
    linkedin,
    github,
    personalWebsite,
    facebook,
    youtube,
  } = req.user.socialLinks || {}; // Use optional chaining to avoid errors if socialLinks is null/undefined

  // Send user data as response
  res.status(200).json({
    success: true,
    user: {
      _id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      jobTitle: req.user.jobTitle,
      bio: req.user.bio,
      avatar: req.user.avatar,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
      role: req.user.role,
      instagram,
      twitter,
      linkedin,
      github,
      personalWebsite,
      facebook,
      youtube,
    },
  });
});

export { getUserProfile };
