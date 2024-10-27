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

  const { thumbnail, image } = req.files; // Assuming multer is configured to handle multiple files

  // Validate ID
  if (!id) {
    throw new ApiError(400, "Id is required");
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid ID format");
  }

  // Find the existing project
  const project = await Project.findById(id);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Handle thumbnail update
  if (thumbnail && thumbnail.length > 0) {
    if (project.thumbnail) {
      const oldThumbnailPublicId = extractPublicIdFromUrl(project.thumbnail);
      await deleteFromCloudinary(oldThumbnailPublicId); // Delete the old thumbnail from Cloudinary
    }
    const newThumbnailUrl = await uploadOnCloudinary(thumbnail[0].buffer, true);
    if (!newThumbnailUrl) {
      throw new ApiError(500, "Failed to upload new thumbnail to Cloudinary");
    }
    project.thumbnail = newThumbnailUrl; // Update the thumbnail URL
  }

  // Handle image update
  if (image && image.length > 0) {
    if (project.image) {
      const oldImagePublicId = extractPublicIdFromUrl(project.image);
      await deleteFromCloudinary(oldImagePublicId); // Delete the old image from Cloudinary
    }
    const newImageUrl = await uploadOnCloudinary(image[0].buffer);
    if (!newImageUrl) {
      throw new ApiError(500, "Failed to upload new image to Cloudinary");
    }
    project.image = newImageUrl; // Update the image URL
  }

  // Update other project fields
  project.title = title || project.title;
  project.description = description || project.description;
  project.technologies = technologies || project.technologies;
  project.githubLink =
    githubLink !== undefined ? githubLink : project.githubLink;
  project.liveDemoLink =
    liveDemoLink !== undefined ? liveDemoLink : project.liveDemoLink;
  project.features = features || project.features;
  project.category = category || project.category;

  // Save the updated project
  await project.save();

  // Send a response with the updated project
  res
    .status(200)
    .json(new ApiResponse(200, project, "Project updated successfully"));
});

export { UpdateProject };
