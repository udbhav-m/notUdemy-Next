import { NextApiRequest, NextApiResponse } from "next";
import { courseStructure, user, courses } from "../_common";
import { userAuthentication } from "../_jwt";

export default async function userCourses(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      userAuthentication(req, res, async () => {
        let publisedCourses = [];
        publisedCourses = await courses.find({ published: true });
        let finalList: courseStructure[] = [];
        publisedCourses.forEach((eachCourse) => {
          console.log(eachCourse);
          let tempObj: courseStructure = {};
          tempObj.title = eachCourse.title;
          tempObj.description = eachCourse.description;
          tempObj.price = eachCourse.price;
          tempObj.imageLink = eachCourse.imageLink;
          tempObj.CourseId = eachCourse.CourseId;
          finalList.push(tempObj);
        });
        res.json(finalList);
      });
    } else {
      console.log({ error: " wrong API request" });
      res.json({ error: " wrong API request" });
    }
  } catch (error: any) {
    console.log(error);
    res.json({ toast: "error", message: error.message });
  }
}
