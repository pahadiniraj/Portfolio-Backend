import { Contact } from "../../models/contact.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";

const createContact = asyncHandler(async (req, res) => {
  const { fullName, email, message, subject } = req.body;

  // Check if the email already exists
  const existedEmail = await Contact.findOne({ email });

  if (existedEmail) {
    // If email already exists, send an error response
    throw new ApiError(
      409,
      "I have already received your email. If you have further concerns, please try again after a few days."
    );
  }

  // If email does not exist, create a new contact
  const newContact = await Contact.create({
    fullName,
    email,
    message,
    subject,
  });

  // Send a success response with the created contact details
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        newContact,
        `${newContact.fullName}, thank you for getting in touch! I've sent more details to your email.`
      )
    );
});

export { createContact };
