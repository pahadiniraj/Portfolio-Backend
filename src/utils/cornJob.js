import cron from "node-cron";
import { User } from "../models/user.model.js";

// Connect to MongoDB (ensure this is done elsewhere in your application)

const checkAndDeleteUnverifiedUsers = async () => {
  console.log("Checking for unverified users to delete...");

  try {
    // Get the current time
    const currentTime = new Date();

    // Find users who are not verified and have been created more than 15 minutes ago
    const deletionTime = new Date(currentTime.getTime() - 15 * 60 * 1000);
    const unverifiedUsers = await User.find({
      isVerified: false,
      createdAt: { $lt: deletionTime },
    });

    // Delete unverified users
    if (unverifiedUsers.length > 0) {
      await User.deleteMany({
        _id: { $in: unverifiedUsers.map((user) => user._id) },
      });
      console.log(`${unverifiedUsers.length} unverified users deleted.`);
    } else {
      console.log("No unverified users found for deletion.");
    }
  } catch (error) {
    console.error("Error checking for unverified users:", error);
  }
};

// Schedule a cron job to run every minute
cron.schedule("* * * * *", checkAndDeleteUnverifiedUsers);

export default checkAndDeleteUnverifiedUsers;

