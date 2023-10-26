import mongoose from "mongoose";

let alreadyDone = false;

async function ensureDbConnected() {
  if (alreadyDone) {
    return "already connnected to mongoose";
  } else {
    alreadyDone = true;
    await mongoose.connect(
      "mongodb+srv://udbhav4:vasudhaM100@cluster0.qcvpegg.mongodb.net/"
    );
  }
}

export { ensureDbConnected };
