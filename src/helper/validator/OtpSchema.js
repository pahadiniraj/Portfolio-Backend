import Joi from "joi";

const verifyOtpSchema = Joi.object({
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
