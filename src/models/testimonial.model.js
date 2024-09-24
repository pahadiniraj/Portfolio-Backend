import mongoose, { Schema } from "mongoose";

// Assuming you have a User model with firstName, lastName, and jobTitle fields
const testimonialSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

// Export the Testimonial model
export const Testimonial = mongoose.model("Testimonial", testimonialSchema);
