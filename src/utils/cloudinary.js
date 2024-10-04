import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "./ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, resize = false) => {
  try {
    if (!localFilePath) {
      console.log("No file path provided");
      return false;
    }

    if (!fs.existsSync(localFilePath)) {
      console.log(`File does not exist: ${localFilePath}`);
      return false;
    }

    const options = {
      resource_type: "auto",
    };

    if (resize) {
      options.transformation = [
        {
          width: 1080,
          height: 1080,
          crop: "fill",
        },
      ];
    }

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, options);

    console.log(
      "File uploaded successfully to Cloudinary:",
      response.secure_url
    );

    // Delete the file locally after successful upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log(`Local file deleted: ${localFilePath}`);
    }

    return response.secure_url;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error.message);

    // Clean up the local file if an error occurred
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log(`Local file deleted after error: ${localFilePath}`);
    }

    return null;
  }
};

// Function to delete a file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    console.log("Attempting to delete file with publicId:", publicId);

    const result = await cloudinary.uploader.destroy(publicId);

    console.log("Cloudinary Deletion Response:", result);

    // Check if the file is already deleted or not found
    if (result.result === "not found") {
      console.log(`File with publicId ${publicId} not found in Cloudinary`);
      return; // No need to throw an error if it's already deleted
    }

    // If deletion was not successful for another reason, throw an error
    if (result.result !== "ok") {
      throw new ApiError(500, "Failed to delete avatar from Cloudinary");
    }

    console.log("File deleted successfully from Cloudinary");
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error.message);
    throw new ApiError(500, "Error occurred while deleting previous avatar");
  }
};

// Function to extract the public ID from a Cloudinary URL
const extractPublicIdFromUrl = (url) => {
  try {
    const segments = url.split("/");
    const publicIdSegment = segments[segments.length - 1].split(".")[0];
    console.log("Extracted publicId:", publicIdSegment);
    return publicIdSegment;
  } catch (error) {
    console.error("Error extracting publicId from URL:", error.message);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary, extractPublicIdFromUrl };
