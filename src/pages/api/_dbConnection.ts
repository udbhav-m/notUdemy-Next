import mongoose from "mongoose";
let alreadyConnected = false;

var URI = process.env.MONGODB_URI as string;
console.log(URI);

if (!URI || URI === undefined) {
  console.log("make sure URI is valid");
}

export function ensureDbConnect() {
  if (!alreadyConnected) {
    try {
      mongoose.connect(URI).then(() => {
        console.log("MongoDB connected");
        alreadyConnected = true;
      });
    } catch (error) {
      console.error("Database connection error:", error);
    }
  }
}
