import Joi from "joi";
import mongoose from "mongoose";

export const projectSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "string.base": "Title should be a string.",
    "string.min": "Title should have at least 3 characters.",
    "string.max": "Title should not exceed 100 characters.",
    "any.required": "Title is required.",
  }),

  description: Joi.string().min(10).required().messages({
    "string.base": "Description should be a string.",
    "string.min": "Description should have at least 10 characters.",
    "any.required": "Description is required.",
  }),

  features: Joi.array()
    .items(Joi.string().min(3).max(255))
    .required()
    .messages({
      "array.base": "Features must be an array of strings.",
      "any.required": "Features are required.",
    }),

  technologies: Joi.array()
    .items(Joi.string().min(2).max(50))
    .required()
    .messages({
      "array.base": "Technologies must be an array of strings.",
      "any.required": "Technologies are required.",
    }),

  githubLink: Joi.string().uri().optional().messages({
    "string.uri": "GitHub link must be a valid URL.",
  }),

  liveDemoLink: Joi.string().uri().optional().messages({
    "string.uri": "Live demo link must be a valid URL.",
  }),

  createdBy: Joi.string()
    .custom((value, helpers) => {
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .optional()
    .messages({
      "any.invalid": "CreatedBy must be a valid ObjectId.",
    }),

  category: Joi.string().min(3).max(100).required().messages({
    "string.base": "Category should be a string.",
    "string.min": "Category should have at least 3 characters.",
    "string.max": "Category should not exceed 100 characters.",
    "any.required": "Category is required.",
  }),
});
