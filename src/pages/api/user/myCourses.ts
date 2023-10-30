import { NextApiRequest, NextApiResponse } from "next";
import { courseStructure, user, courses } from "../_common";
import { userAuthentication } from "../_jwt";

export default async function myCourses(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      userAuthentication(req, res, async () => {
        let username = req.headers.username;
        let coursesp = [];
        let currUser = await user.findOne({ username });
        if (currUser) {
          for (let eachCourseId of currUser.coursesPurchased) {
            let course = await courses.findOne({ _id: eachCourseId });
            if (course) {
              let tempObj: courseStructure = {};
              tempObj.title = course.title;
              tempObj.description = course.description;
              tempObj.price = course.price;
              tempObj.imageLink = course.imageLink;
              tempObj.CourseId = course.CourseId;
              coursesp.push(tempObj);
            }
          }
          res.json(coursesp);
        } else {
          console.log({
            toast: "error",
            message: "You don't have any courses",
          });
          res.json({ toast: "error", message: "You don't have any courses" });
        }
      });
    }
  } catch (error: any) {
    console.log({ toast: "error", message: error.message });
    res.json({ toast: "error", message: error.message });
  }
}
