// cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "./ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (fileBuffer, resize = false) => {
  try {
    if (!fileBuffer) {
      throw new ApiError(400, "Error uploading: No file buffer provided.");
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

    const response = await cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error)
          throw new ApiError(500, "Cloudinary upload error: " + error.message);
        return result;
      }
    );

    console.log(
      "File uploaded successfully to Cloudinary:",
      response.secure_url
    );
    return response.secure_url;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error.message);
    throw new ApiError(500, "Error occurred while uploading avatar");
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    console.log("Attempting to delete file with publicId:", publicId);

    const result = await cloudinary.uploader.destroy(publicId);

    console.log("Cloudinary Deletion Response:", result);

    if (result.result === "not found") {
      console.log(`File with publicId ${publicId} not found in Cloudinary`);
      return;
    }

    if (result.result !== "ok") {
      throw new ApiError(500, "Failed to delete avatar from Cloudinary");
    }

    console.log("File deleted successfully from Cloudinary");
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error.message);
    throw new ApiError(500, "Error occurred while deleting previous avatar");
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
