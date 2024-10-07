import { Project } from "../../models/project.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";

const GetProjectById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "ID is required");
  }

  const project = await Project.findById(id).populate({
    path: "createdBy",
    select: "firstName lastName createdAt",
  });
  if (!project) {
    throw new ApiError(400, "Project not found");
  }
  res.status(200).json(new ApiResponse(200, project, "success"));
});

export { GetProjectById };
