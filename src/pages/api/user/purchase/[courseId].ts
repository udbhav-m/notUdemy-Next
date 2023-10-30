import { NextApiRequest, NextApiResponse } from "next";
import { user, courses } from "../../_common";
import { userAuthentication } from "../../_jwt";
import mongoose from "mongoose";
interface courseParam {
  courseId: number;
}

interface courseStructure {
  _id?: any;
  title?: string;
  description?: string;
  price?: number;
  imageLink?: string;
  published?: boolean;
  CourseId?: number;
}

export default async function purchaseCourse(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      userAuthentication(req, res, async () => {
        const courseId = req.query.courseId as unknown as courseParam;
        const username = req.headers.username;

        try {
          const courseToPurchase = await courses.findOne({
            CourseId: courseId, // Make sure this matches your courses schema
            published: true,
          });

          if (!courseToPurchase) {
            return res.json({
              toast: "error",
              message: `Failed: Course ${courseId} doesn't exist`,
            });
          }

          const currentUser = await user.findOne({ username });

          if (!currentUser) {
            return res.json({
              toast: "error",
              message: "User not found",
            });
          }

          const courseAlreadyPurchased = currentUser.coursesPurchased.includes(
            courseToPurchase._id
          );

          if (courseAlreadyPurchased) {
            return res.json({
              toast: "info",
              message: `${currentUser.username}, Course ${courseId} is purchased already`,
            });
          }

          currentUser.coursesPurchased.push(courseToPurchase._id);

          await currentUser.save();

          console.log({
            message: `${currentUser.username}, Course ${courseId} purchased successfully`,
          });

          return res.json({
            toast: "success",
            message: `${currentUser.username}, Course ${courseId} purchased successfully`,
          });
        } catch (error) {
          console.error(error);
          return res.json({
            toast: "error",
            message: "An error occurred while processing the request",
          });
        }
      });
    }
  } catch (err: any) {
    res.json({ toast: "error", message: err.message });
  }
}
