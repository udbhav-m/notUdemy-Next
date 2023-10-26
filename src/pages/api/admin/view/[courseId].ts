import { NextApiRequest, NextApiResponse } from "next";
import { courses } from "../../_common";
import { adminAuthentication } from "../../_jwt";
interface courseParam {
  courseId: number;
}

export default async function viewAPI(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      adminAuthentication(req, res, async () => {
        let courseId = req.query.courseId as unknown as courseParam;
        let courseIdInt = courseId;
        if (courseIdInt && typeof courseIdInt === typeof `courseParam`) {
          const course = await courses.findOne({ CourseId: courseIdInt });
          if (course) {
            console.log({ success: `found the course ${course}` });
            res.send(course);
          } else {
            console.log({
              toast: "error",
              message: `the course with ${courseIdInt} does not exist`,
            });
            res.json({
              toast: "error",
              message: `the course with ${courseIdInt} does not exist`,
            });
          }
        } else {
          console.log("Invalid course ID");
          res.json({ error: "Invalid course ID" });
        }
      });
    }
  } catch (error: any) {
    console.log({ toast: "error", message: error.message });
    res.json({ toast: "error", message: error.message });
  }
}
