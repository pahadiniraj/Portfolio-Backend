import Joi from "joi";

const passwordResetSchema = Joi.object({
  password: Joi.string().min(8).required().messages({
    "string.base": "Password should be a type of text",
    "string.empty": "Password is required",
    "string.min":
      "Password should have a minimum length of {#limit} characters",
    "any.required": "Password is required",
  }),
  confirmPassword: Joi.string().min(8).required().messages({
    "string.base": "Password should be a type of text",
    "string.empty": "Password is required",
    "string.min":
      "Password should have a minimum length of {#limit} characters",
    "any.required": "Password is required",
  }),
});

const passwordResetEmailLinkSchema = Joi.object({
  email: Joi.string().email().lowercase().required().messages({
    "string.base": "Email should be a type of text",
    "string.empty": "Email cannot be empty",
    "string.email": "Email must be a valid email address",
    "any.required": "Email is a required field",
  }),
});

export { passwordResetSchema, passwordResetEmailLinkSchema };
