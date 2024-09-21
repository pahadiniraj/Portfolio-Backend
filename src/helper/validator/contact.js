import Joi from "joi";

// Define the registration schema using Joi
const createContactSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(50).required().messages({
    "string.base": "Full-Name should be a type of text",
    "string.empty": "Full-Name cannot be empty",
    "string.min": "Full-Name should have a minimum length of {#limit}",
    "string.max": "Full-Name should have a maximum length of {#limit}",
    "any.required": "Full-Name is a required field",
  }),

  email: Joi.string().email().lowercase().required().messages({
    "string.base": "Email should be a type of text",
    "string.empty": "Email cannot be empty",
    "string.email": "Email must be a valid email address",
    "any.required": "Email is a required field",
  }),

  subject: Joi.string().trim().min(3).max(100).required().messages({
    "string.base": "Subject should be a type of text",
    "string.empty": "Subject cannot be empty",
    "string.min": "Subject should have a minimum length of {#limit}",
    "string.max": "Subject should have a maximum length of {#limit}",
    "any.required": "Subject is a required field",
  }),

  message: Joi.string().trim().min(10).required().messages({
    "string.base": "Message should be a type of text",
    "string.empty": "Message cannot be empty",
    "string.min": "Message should have a minimum length of {#limit}",
    "any.required": "Message is a required field",
  }),
});

export { createContactSchema };
