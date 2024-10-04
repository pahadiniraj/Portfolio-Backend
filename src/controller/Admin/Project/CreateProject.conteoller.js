import mongoose from "mongoose";
import { Project } from "../../../models/project.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../../../utils/cloudinary.js";

const createProject = asyncHandler(async (req, res) => {
  const { thumbnail, image } = req.files;
  console.log(req.body);
  console.log(req.files);

  if (!thumbnail || !image) {
    throw new ApiError(400, "Thumbnail and image files are required");
  }

  const imageUrl = await uploadOnCloudinary(image[0].path);

  const thumbnailUrl = await uploadOnCloudinary(thumbnail[0].path, true);

  const {
    title,
    description,
    features,
    technologies,
    githubLink,
    liveDemoLink,
    category,
  } = req.body;

  if (!title || !description || !features || !technologies || !category) {
    throw new ApiError(400, "All fields are required");
  }

  const createdBy = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(createdBy)) {
    throw new ApiError(400, "Invalid ObjectId for createdBy");
  }

  const newProject = await Project.create({
    title,
    description,
    features,
    technologies,
    image: imageUrl,
    thumbnail: thumbnailUrl,
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
