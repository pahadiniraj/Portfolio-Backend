import mongoose, { Schema } from "mongoose";

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
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 2 * 24 * 60 * 60,
    },
  },
  {
    timestamps: true, // Create createdAt and updatedAt fields
  }
);

export const Contact = mongoose.model("Contact", contactSchema);
