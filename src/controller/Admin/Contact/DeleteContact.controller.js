import { Contact } from "../../../models/contact.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/AsyncHandler.js";
import mongoose from "mongoose";

const DeleteContact = asyncHandler(async (req, res) => {
  const { _id } = req.body;

  // Validate _id
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw new ApiError(400, "Invalid contact ID");
  }

  // Check if contact exists
  const contact = await Contact.findById(_id);
  if (!contact) {
    throw new ApiError(404, "Contact not found");
  }

  // Delete the contact
  await Contact.findByIdAndDelete(_id);

  res.status(200).json(new ApiResponse(200, "Contact removed successfully"));
});

export { DeleteContact };
