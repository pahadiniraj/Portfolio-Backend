import Joi from "joi";

const verifyOtpSchema = Joi.object({
  otp: Joi.number()
    .integer() // Ensure it's an integer
    .min(1000) // Minimum value is 1000 (4 digits)
    .max(9999) // Maximum value is 9999 (4 digits)
    .required() // OTP field is required
    .messages({
      "number.base": "OTP must be a number.",
      "number.min": "OTP must be exactly 4 digits long.",
      "number.max": "OTP must be exactly 4 digits long.",
      "any.required": "OTP is required.",
    }),
});

export { verifyOtpSchema };
