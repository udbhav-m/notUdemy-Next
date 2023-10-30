import { NextApiRequest, NextApiResponse } from "next";
import { courseStructure, user, courses } from "../../_common";
import { userAuthentication } from "../../_jwt";

interface courseParam {
  courseId: number;
}

export default async function viewCourse(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      userAuthentication(req, res, async () => {
        let courseId = req.query.courseId as unknown as courseParam;
        const course = await courses.findOne({ CourseId: courseId });
        if (course) {
          console.log({ success: `found the course ${course}` });
          res.send(course);
        } else {
          console.log({
            toast: "error",
            message: `the course with ${courseId} does not exist`,
          });
          res.json({
            toast: "error",
            message: `the course with ${courseId} does not exist`,
          });
        }
      });
    }
  } catch (error: any) {
    console.log({ toast: "error", message: error.message });
    res.json({ toast: "error", message: error.message });
  }
}
