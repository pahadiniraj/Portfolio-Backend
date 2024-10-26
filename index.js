import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import app from "./app.js"; // Import the default export directly

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB()
  .then(() => {
    // Handle server errors
    app.on("error", (err) => {
      console.error("Server error:", err);
      throw err;
    });

    // Define the port and start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1); // Exit the process if the database connection fails
  });
