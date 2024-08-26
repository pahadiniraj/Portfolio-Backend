import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      required: true,
    },
    technologies: {
      type: [String],
      required: true,
    },
    images: {
      type: [String], // Array of image URLs
      required: true,
    },
    githubLink: {
      type: String,
    },
    liveDemoLink: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categories: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        required: true,
        unique: true,
      },
    ],
    likes: {
      type: [mongoose.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model("Project", projectSchema);
