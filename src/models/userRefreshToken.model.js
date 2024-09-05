import mongoose, { Schema } from "mongoose";

const userRefreshTokenSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  blacklist: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 24 * 60 * 60, // 5 days in seconds
  },
});

export const UserRefreshToken = mongoose.model(
  "UserRefreshToken",
  userRefreshTokenSchema
);
