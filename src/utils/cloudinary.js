// cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "./ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (fileBuffer, resize = false) => {
  return new Promise((resolve, reject) => {
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

    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error.message);
          reject(
            new ApiError(500, "Cloudinary upload error: " + error.message)
          );
        } else {
          console.log(
            "File uploaded successfully to Cloudinary:",
            result.secure_url
          );
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(fileBuffer); // Send the file buffer to Cloudinary
  });
};

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== "ok") {
      throw new ApiError(500, "Failed to delete file from Cloudinary");
    }
    console.log("File deleted successfully from Cloudinary");
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error.message);
    throw new ApiError(
      500,
      "Error occurred while deleting file from Cloudinary"
    );
  }
};

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
