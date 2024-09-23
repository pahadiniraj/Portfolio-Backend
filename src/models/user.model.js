import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      set: (value) =>
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      set: (value) =>
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    jobTitle: {
      type: String,
      trim: true,
      set: (value) => {
        if (value && value.trim() !== "") {
          return value.toUpperCase();
        }
        return value;
      },
      default: null,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    googleId: {
      type: String,
      unique: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      trim: true,
      default: null,
    },
    // Add social media links as optional fields
    socialLinks: {
      instagram: { type: String, default: null, trim: true },
      linkedin: { type: String, default: null, trim: true },
      facebook: { type: String, default: null, trim: true },
      twitter: { type: String, default: null, trim: true },
      personalWebsite: { type: String, default: null, trim: true },
      github: { type: String, default: null, trim: true },
      youtube: { type: String, default: null, trim: true },
    },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving if it's modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Check if the provided password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
  console.log("Hashed Password:", this.password);
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
