import Joi from "joi";
import mongoose from "mongoose";

const DeleteAccountSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please enter a valid email address.",
      "string.empty": "Email is required.",
      "any.required": "Email is required.",
    }),

  password: Joi.string().min(8).required().messages({
    "string.base": "Password should be a type of text.",
    "string.empty": "Password is required.",
    "string.min":
      "Password should have a minimum length of {#limit} characters.",
    "any.required": "Password is required.",
  }),

  _id: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .required()
    .messages({
      "any.invalid": "Invalid ID format.",
      "string.empty": "ID is required.",
      "any.required": "ID is required.",
    }),
});

export { DeleteAccountSchema };
