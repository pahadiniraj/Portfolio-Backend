import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import { app } from "./app.js";

// Load environment variables from .env file
dotenv.config({
  path: "./.env",
});

// Connect to MongoDB
connectDB()
  .then(() => {
    // Handle server errors
    app.on("error", (err) => {
      console.error("Server error:", err);
      throw err;
    });

    // Define a root route
    app.get("/", (req, res) => {
      res.send("Hello, World! I'm Niraj!");
    });

    // Start the server
    const PORT = process.env.PORT || 3000; // Default to 3000 if PORT is not set
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1); // Exit the process if the database connection fails
  });

export default app;
