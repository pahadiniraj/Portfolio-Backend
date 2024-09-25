import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "./ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return false;

    // Check for file existence
    if (!fs.existsSync(localFilePath)) {
      console.log(`File does not exist ${localFilePath}`);
      return false;
    }

    // Upload and resize the image to 1080x1080
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      transformation: [
        {
          width: 1080,
          height: 1080,
          crop: "fill", // "fill" ensures the image is resized to fit exactly 1080x1080
        },
      ],
    });

    console.log(
      "File uploaded and resized successfully in Cloudinary",
      response.url
    );
    return response;
  } catch (error) {
    console.error("Error uploading file to Cloudinary", error.message);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

// Function to delete a file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    console.log("Cloudinary uploader:", cloudinary.uploader);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("File deleted successfully from Cloudinary", result);
    if (result.result !== "ok") {
      throw new ApiError(500, "Failed to delete avatar from Cloudinary");
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error.message);
    throw new ApiError(500, "Error occurred while deleting previous avatar");
  }
};

// Function to extract public ID from Cloudinary URL
const extractPublicIdFromUrl = (url) => {
  const segments = url.split("/");
  const publicIdSegment = segments[segments.length - 1].split(".")[0];
  return publicIdSegment;
};

export { uploadOnCloudinary, deleteFromCloudinary, extractPublicIdFromUrl };
