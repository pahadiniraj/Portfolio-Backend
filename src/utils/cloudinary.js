import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "./ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.API_KEY_CLOUDINARY,
  api_secret: process.env.API_SECRET_CLOUDINARY,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return false;

    // check for file

    if (!fs.existsSync(localFilePath)) {
      console.log(`File doesnot exist ${localFilePath}`);
      return false;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File uploaded successfully in cloduinary", response.url);
    return response;
  } catch (error) {
    console.error("Error uploading file to cloudinary", error.message);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    console.log("Cloudinary uploader:", cloudinary.uploader);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("File deleted successfully from cloudinary", result);
    if (result.result !== "ok") {
      throw new ApiError(500, "Failed to delete avatar from cloudinary");
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error.message); // Log the error message
    throw new ApiError(500, "Error occurred while deleting previous avatar");
  }
};

const extractPublicIdFromUrl = (url) => {
  const segments = url.split("/");
  const publicIdSegment = segments[segments.length - 1].split(".")[0];
  return publicIdSegment;
};

export { uploadOnCloudinary, deleteFromCloudinary, extractPublicIdFromUrl };
