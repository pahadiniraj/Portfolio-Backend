import mongoose from "mongoose";
import { DB_NAME } from "../../constants.js";

const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error("MongoDB URI is not defined in environment variables.");
    }

    // Connect to MongoDB (no need for useNewUrlParser or useUnifiedTopology)
    const connectInstance = await mongoose.connect(
      `${MONGODB_URI}/${DB_NAME}`,
      {
        serverSelectionTimeoutMS: 30000, // 30 seconds timeout
      }
    );

    // Log successful connection
    console.log(
      `\nMongoDB Connected!! DB HOST: ${connectInstance.connection.host}`
    );
  } catch (error) {
    // Log detailed error message
    console.error(
      `MongoDB connection failed: ${error.message}. Stack Trace: ${error.stack}`
    );

    // Optionally exit process with failure
    process.exit(1);
  }
};

export default connectDB;
