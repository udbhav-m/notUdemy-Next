import mongoose from "mongoose";
let alreadyConnected = false;
const URI =
  typeof process.env.MONGODB_URI === "string" ? process.env.MONGODB_URI : "";

export function ensureDbConnect() {
  if (!alreadyConnected) {
    try {
      // Connect to the database
      mongoose.connect(URI).then(() => {
        console.log("MongoDB connected");
        alreadyConnected = true;
      });
    } catch (error) {
      console.error("Database connection error:", error);
    }
  }
}
