import mongoose from "mongoose";
import { z } from "zod";

export const inputvalues = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export interface courseStructure {
  title?: string;
  description?: string;
  price?: number;
  imageLink?: string;
  published?: boolean;
  CourseId?: number;
}

export interface userStructure {
  username: string;
  password: string;
  coursesPublished?: any;
  coursesPurchased?: any;
}

// Mongoose Schema and Models
export const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
  coursesPublished: [{ type: mongoose.Schema.Types.ObjectId, ref: "courses" }],
});

export const coursesSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
  CourseId: Number,
  author: String,
});

export const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  coursesPurchased: [{ type: mongoose.Schema.Types.ObjectId, ref: "courses" }],
});

export const admin =
  mongoose.models.admin || mongoose.model("admin", adminSchema);
export const courses =
  mongoose.models.courses || mongoose.model("courses", coursesSchema);
export const user = mongoose.models.user || mongoose.model("user", userSchema);
