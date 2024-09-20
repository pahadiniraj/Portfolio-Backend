import { Contact } from "../../../models/contact.model.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/AsyncHandler.js";

const getAllContact = asyncHandler(async (req, res) => {
  const allContact = await Contact.find();

  res.status(200).json(new ApiResponse(200, allContact, "All contact found"));
});

export { getAllContact };
