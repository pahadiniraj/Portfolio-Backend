import { Project } from "../../../models/project.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/AsyncHandler.js";
import mongoose from "mongoose";
import {
  deleteFromCloudinary,
  extractPublicIdFromUrl,
  uploadOnCloudinary,
} from "../../../utils/cloudinary.js";

const UpdateProject = asyncHandler(async (req, res) => {
  const {
    id,
    title,
    description,
    technologies,
    githubLink,
    liveDemoLink,
    features,
    category,
  } = req.body;
  const { thumbnail, image } = req.files;

  if (!id) {
    throw new ApiError(400, "Id is required");
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid ID format");
  }

  const project = await Project.findById(id);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (thumbnail) {
    if (project.thumbnail) {
      const oldThumbnailPublicId = extractPublicIdFromUrl(project.thumbnail);
      await deleteFromCloudinary(oldThumbnailPublicId);
    }
    const newThumbnailUrl = await uploadOnCloudinary(thumbnail[0].path, true);
    if (!newThumbnailUrl) {
      throw new ApiError(500, "Failed to upload new thumbnail to Cloudinary");
    }
    project.thumbnail = newThumbnailUrl;
  }

  if (image) {
    if (project.image) {
      const oldImagePublicId = extractPublicIdFromUrl(project.image);
      await deleteFromCloudinary(oldImagePublicId);
    }
    const newImageUrl = await uploadOnCloudinary(image[0].path);
    if (!newImageUrl) {
      throw new ApiError(500, "Failed to upload new image to Cloudinary");
    }
    project.image = newImageUrl;
  }

  project.title = title || project.title;
  project.description = description || project.description;
  project.technologies = technologies || project.technologies;
  project.githubLink =
    githubLink !== undefined ? githubLink : project.githubLink;
  project.liveDemoLink =
    liveDemoLink !== undefined ? liveDemoLink : project.liveDemoLink;
  project.features = features || project.features;
  project.category = category || project.category;

  await project.save();

  res
    .status(200)
    .json(new ApiResponse(200, project, "Project updated successfully"));
});

export { UpdateProject };
