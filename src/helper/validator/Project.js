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

  images: Joi.array().items(Joi.string().uri()).required().messages({
    "array.base": "Images must be an array of valid URLs.",
    "string.uri": "Each image must be a valid URL.",
    "any.required": "Images are required.",
  }),

  githubLink: Joi.string().uri().optional().messages({
    "string.uri": "GitHub link must be a valid URL.",
  }),

  liveDemoLink: Joi.string().uri().optional().messages({
    "string.uri": "Live demo link must be a valid URL.",
  }),

  createdBy: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .required()
    .messages({
      "any.invalid": "CreatedBy must be a valid ObjectId.",
      "any.required": "CreatedBy is required.",
    }),

  categories: Joi.array()
    .items(
      Joi.string()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
          }
          return value;
        })
        .required()
    )
    .required()
    .messages({
      "any.invalid": "Each category must be a valid ObjectId.",
      "any.required": "Categories are required.",
    }),
});

export { projectSchema };
