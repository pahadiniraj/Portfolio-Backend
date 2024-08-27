import Joi from "joi";

// Define the registration schema using Joi
const registerSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required().messages({
    "string.base": "First name should be a type of text",
    "string.empty": "First name cannot be empty",
    "string.min": "First name should have a minimum length of {#limit}",
    "string.max": "First name should have a maximum length of {#limit}",
    "any.required": "First name is a required field",
  }),

  lastName: Joi.string().trim().min(2).max(50).required().messages({
    "string.base": "Last name should be a type of text",
    "string.empty": "Last name cannot be empty",
    "string.min": "Last name should have a minimum length of {#limit}",
    "string.max": "Last name should have a maximum length of {#limit}",
    "any.required": "Last name is a required field",
  }),

  email: Joi.string().email().lowercase().required().messages({
    "string.base": "Email should be a type of text",
    "string.empty": "Email cannot be empty",
    "string.email": "Email must be a valid email address",
    "any.required": "Email is a required field",
  }),

  password: Joi.string()
    .min(8)
    .max(128)
    .when("googleId", {
      is: Joi.exist(), // If googleId exists, password is not required
      then: Joi.string().optional(),
      otherwise: Joi.string().required(),
    })
    .messages({
      "string.base": "Password should be a type of text",
      "string.empty": "Password cannot be empty",
      "string.min": "Password should have a minimum length of {#limit}",
      "string.max": "Password should have a maximum length of {#limit}",
      "any.required":
        "Password is a required field unless you sign up with Google",
    }),

  googleId: Joi.string().optional().messages({
    "string.base": "Google ID should be a type of text",
  }),

  avatar: Joi.string().uri().optional().messages({
    "string.base": "Avatar should be a valid URI",
  }),

  role: Joi.string().valid("user", "admin").default("user").messages({
    "string.base": "Role should be a type of text",
    "any.only": "Role must be either 'user' or 'admin'",
  }),

  refreshToken: Joi.string().optional().messages({
    "string.base": "Refresh token should be a type of text",
  }),

  resetPasswordToken: Joi.string().optional().messages({
    "string.base": "Reset Password Token should be a type of text",
  }),

  resetPasswordExpires: Joi.date().optional().messages({
    "date.base": "Reset Password Expires should be a valid date",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Disables TLD validation to allow any email domain
    .required()
    .messages({
      "string.base": "Email should be a type of text",
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),

  password: Joi.string().min(8).required().messages({
    "string.base": "Password should be a type of text",
    "string.empty": "Password is required",
    "string.min":
      "Password should have a minimum length of {#limit} characters",
    "any.required": "Password is required",
  }),
});

export { registerSchema, loginSchema };
