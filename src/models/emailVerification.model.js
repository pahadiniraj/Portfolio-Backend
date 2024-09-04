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
    expires: "10m",
  },
});

export const EmailVerification = mongoose.model(
  "EmailVerification",
  emailVerificationSchema
);
