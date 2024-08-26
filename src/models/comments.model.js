import mongoose, { Schema } from "mongoose";

// Define the comment schema
const commentSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  projectId: {
    type: mongoose.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  likes: {
    type: [mongoose.Types.ObjectId], // Array of user IDs who liked the comment
    ref: "User",
    default: [],
  },
  replies: [
    {
      userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      likes: {
        type: [mongoose.Types.ObjectId], // Array of user IDs who liked the reply
        ref: "User",
        default: [],
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Comment = mongoose.model("Comment", commentSchema);
