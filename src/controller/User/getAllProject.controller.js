import { Project } from "../../models/project.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";

const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find()
    .populate({
      path: "createdBy",
      select: "firstName lastName jobTitle email",
    })
    .exec();
  res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects data fetched successfully"));
});

export { getAllProjects };
