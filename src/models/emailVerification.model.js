import mongoose, { Schema } from "mongoose";

const emailVerificationSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 10 * 60, // 10 minutes in seconds
  },
});

export const EmailVerification = mongoose.model(
  "EmailVerification",
  emailVerificationSchema
);
