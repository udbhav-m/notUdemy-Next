import { NextApiRequest, NextApiResponse } from "next";
import { courseStructure,admin, courses } from "../_common";
import { adminAuthentication } from "../_jwt";
export default async function getCoursesAPI(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("Starting API execution");
    if (req.method === "GET") {
      adminAuthentication(req, res, async () => {
        let username = req.headers.username;
        if (username && typeof username === "string") {
          console.log("Fetching courses for username:", username);
          const output = await getCourses(username);
          res.json(output);
        } else {
          console.log("Invalid username in request headers");
          res.status(400).json({ toast: "error", message: "Invalid username" });
        }
      });
    }
    console.log("API execution completed");
  } catch (error: any) {
    console.log("API error:", error.message);
    res.status(500).json({ toast: "error", message: error.message });
  }
}

async function getCourses(username: string) {
  try {
    let creator = await admin.findOne({ username });
    let finalList = [];
    if (creator) {
      for (let eachCourseId of creator.coursesPublished) {
        let course = await courses.findOne({ _id: eachCourseId });
        if (course) {
          let tempObj: courseStructure = {};

          tempObj.title = course.title;
          tempObj.description = course.description;
          tempObj.price = course.price;
          tempObj.imageLink = course.imageLink;
          tempObj.published = course.published;
          tempObj.CourseId = course.CourseId;
          finalList.push(tempObj);
        }
      }
      if (finalList.length === 0) {
        return { toast: "error", Message: "No courses Published" };
      } else {
        console.log(finalList);
        return finalList;
      }
    }
  } catch (error: any) {
    console.log({ toast: "error", message: error.message });
    return { toast: "error", message: error.message };
  }
}
