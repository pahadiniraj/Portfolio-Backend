import { asyncHandler } from "../../utils/AsyncHandler.js";

// Ensure `req.user` contains the user information after authentication
const getUserProfile = asyncHandler(async (req, res) => {
  // Check if user is available on req object
  if (!req.user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Send user data as response
  res.status(200).json({
    success: true,
    user: {
      _id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      isVerified: req.user.isVerified,
      jobTitle: req.user.jobTitle,
      role: req.user.role,
      bio: req.user.bio,
      avatar: req.user.avatar,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
      instagram: req.user.instagram,
      twitter: req.user.twitter,
      linkedin: req.user.linkedin,
      github: req.user.github,
      personalWebsite: req.user.personalWebsite,
      facebook: req.user.facebook,
    },
  });
});

export { getUserProfile };
