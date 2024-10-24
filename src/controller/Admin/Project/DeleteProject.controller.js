import { Project } from "../../../models/project.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/AsyncHandler.js";

const DeleteProject = asyncHandler(async (req, res) => {
  const { _id, id } = req.body;

  if (!_id) {
    throw new ApiError("Project ID is required");
  }
  const project = await Project.findByIdAndDelete(_id);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        project,
        `${project.title} project deleted successfully`
      )
    );
});
export { DeleteProject };
