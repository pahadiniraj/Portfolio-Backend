import mongoose from "mongoose";
import { Project } from "../../../models/project.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../../../utils/cloudinary.js";

const createProject = asyncHandler(async (req, res) => {
  const files = req.files;

  if (!files) {
    throw new ApiError(400, "At least one image file is required");
  }

  const imageUploadPromises = files.map((file) =>
    uploadOnCloudinary(file.path).then((result) => result.secure_url)
  );
  const imageUrls = await Promise.all(imageUploadPromises);

  const {
    title,
    description,
    features,
    technologies,
    githubLink,
    liveDemoLink,
    category,
  } = req.body;

  // Ensure all required fields are present
  if (!title || !description || !features || !technologies || !category) {
    throw new ApiError(400, "All fields are required");
  }

  const createdBy = req.user._id;

  // Optional: Validate createdBy to ensure it’s a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(createdBy)) {
    throw new ApiError(400, "Invalid ObjectId for createdBy");
  }

  // Create the new project
  const newProject = await Project.create({
    title,
    description,
    features,
    technologies,
    images: imageUrls, // Save array of image URLs
    githubLink,
    liveDemoLink,
    category,
    createdBy,
  });

  res
    .status(200)
    .json(new ApiResponse(200, newProject, "New Project created successfully"));
});

export { createProject };
