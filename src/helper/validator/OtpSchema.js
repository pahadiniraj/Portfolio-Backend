import Joi from "joi";

const verifyOtpSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Ensure it's a valid email address
    .required() // Make the email field required
    .messages({
      "string.email": "Please provide a valid email address.",
      "string.empty": "Email cannot be empty.",
      "any.required": "Email is required.",
    }),

  otp: Joi.string()
    .length(4) // Ensure the OTP is exactly 4 characters long
    .pattern(/^[0-9]+$/) // Ensure the OTP consists only of digits
    .required() // Make the OTP field required
    .messages({
      "string.length": "OTP must be exactly 4 digits long.",
      "string.pattern.base": "OTP must contain only digits.",
      "string.empty": "OTP cannot be empty.",
      "any.required": "OTP is required.",
    }),
});

export { verifyOtpSchema };
