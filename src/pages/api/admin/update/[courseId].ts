import { NextApiRequest, NextApiResponse } from "next";
import { adminAuthentication } from "../../_jwt";
import { useRouter } from "next/router";
import { courseStructure, courses } from "../../_common";

interface courseParam {
  courseId: number;
}

export default async function updateAPI(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "PUT") {
      adminAuthentication(req, res, async () => {
        const router = useRouter();
        let courseId = req.query.courseId as unknown as courseParam;
        const course = req.body;
        if (courseId && typeof `courseParam`) {
          const output = updateCourse(courseId, course);
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

async function updateCourse(
  courseId: number | courseParam,
  course: courseStructure
) {
  try {
    let { title, description, price, imageLink, published } = course;
    if (title && description) {
      let courseExists = await courses.findOne({ CourseId: courseId });
      if (courseExists) {
        courseExists.title = title;
        courseExists.description = description;
        courseExists.price = price;
        courseExists.imageLink = imageLink;
        courseExists.published = published;
        await courseExists.save();
        console.log({ toast: "success", message: `course details updated` });
        return { toast: "success", message: `course details updated` };
      } else {
        console.log({ toast: "error", message: `course not found` });
        return { toast: "error", message: `course not found` };
      }
    } else {
      console.log({
        toast: "error",
        message: `title and description cannot be empty`,
      });
      return {
        toast: "error",
        message: `title and description cannot be empty`,
      };
    }
  } catch (error: any) {
    console.log({ toast: "error", message: error.message });
    return { toast: "error", message: error.message };
  }
}
