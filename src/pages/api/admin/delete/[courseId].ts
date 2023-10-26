import { NextApiRequest, NextApiResponse } from "next";
import { adminAuthentication } from "../../_jwt";
import { admin, courses } from "../../_common";
interface courseParams {
  courseId: number;
}

export default async function deleteAPI(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "DELETE") {
      adminAuthentication(req, res, async () => {
        const { courseId } = req.query as unknown as courseParams;
        console.log(courseId);
        if (courseId && typeof courseId === typeof `courseParams`) {
          const output = deleteCourse(courseId);
          console.log(output);
          res.json(output);
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

async function deleteCourse(courseId: number) {
  try {
    let courseExists = await courses.findOne({ CourseId: courseId });
    if (courseExists) {
      let objId = courseExists._id;
      let adminUser = await admin.findOne({ username: courseExists.author });
      if (adminUser) {
        let adminCourses = adminUser.coursesPublished;
        let updatedCourses = adminCourses.filter(
          (eachObjId: any) => eachObjId.toString() !== objId.toString()
        );
        await courses.findOneAndRemove({ CourseId: courseId });
        adminUser.coursesPublished = updatedCourses;
        await adminUser.save();
        console.log({
          toast: "success",
          message: `Deleted course and updated with admin`,
        });
        return {
          toast: "success",
          message: `Deleted course and updated with admin`,
        };
      } else {
        console.log({ toast: "error", message: `Admin user not found` });
        return { toast: "error", message: `Admin user not found` };
      }
    } else {
      console.log({ toast: "error", message: `Course not found` });
      return { toast: "error", message: `Course not found` };
    }
  } catch (error: any) {
    console.log({ toast: "error", message: error.message });
    return { toast: "error", message: error.message };
  }
}
