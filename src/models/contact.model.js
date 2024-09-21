import mongoose, { Schema } from "mongoose";

const statusEnum = ["unseen", "inprogress", "completed", "rejected"];

const contactSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: statusEnum,
      default: "unseen", // Initial status when created
    },
  },
  {
    timestamps: true, // Create createdAt and updatedAt fields
  }
);

export const Contact = mongoose.model("Contact", contactSchema);
