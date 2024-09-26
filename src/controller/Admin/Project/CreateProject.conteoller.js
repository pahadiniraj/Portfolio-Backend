import { Project } from "../../../models/project.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../../../utils/cloudinary.js";

const createProject = asyncHandler(async (req, res) => {
  const files = req.files; // Get the uploaded files

  // Check if at least one image is uploaded
  if (!files) {
    throw new ApiError(400, "At least one image file is required");
  }

  console.log(files);

  // Upload each image to Cloudinary and store URLs
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
    categories,
  } = req.body;

  // Validate required fields
  if (!title || !description || !features || !technologies || !categories) {
    throw new ApiError(400, "All fields are required");
  }

  // Create new project with uploaded image URLs
  const newProject = await Project.create({
    title,
    description,
    features,
    technologies,
    images: imageUrls, // Save array of image URLs
    githubLink,
    liveDemoLink,
    categories,
  });

  res
    .status(200)
    .json(new ApiResponse(200, newProject, "New Project created successfully"));
});

export { createProject };
