import { NextApiRequest, NextApiResponse } from "next";
import { courseStructure, admin, courses } from "../_common";
import { adminAuthentication } from "../_jwt";

export default async function createCourseAPI(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      adminAuthentication(req, res, async () => {
        let username = req.headers.username;
        let courseinp = req.body;
        let valid = false;
        var check = ["title", "description", "price", "imageLink", "published"];

        for (let each in courseinp) {
          if (courseinp[each].length > 1 && check.includes(each)) {
            valid = true;
          }
        }

        if (valid && typeof username === "string") {
          createCourse(courseinp, username)
            .then((outp) => {
              res.send(outp);
            })
            .catch((error) => {
              res.json({ toast: "error", message: error.message });
            });
        } else {
          res.json({ toast: "error", message: "invalid data provided" });
        }
      });
    }
  } catch (error: any) {
    console.log({ toast: "error", message: error.message });
    res.json({ toast: "error", message: error.message });
  }
}

// Function to create a new course
function createCourse(input: courseStructure, creator: string) {
  return new Promise(async (resolve, reject) => {
    try {
      let newCourse = input;
      newCourse.CourseId = Math.floor(Math.random() * 1000);
      let { title, description, price, imageLink, published, CourseId } =
        newCourse;
      let coursesOfcreator = await admin.findOne({ username: creator });
      if (coursesOfcreator) {
        let coursesAlready = coursesOfcreator.coursesPublished;
        let newC = new courses({
          title,
          description,
          price,
          imageLink,
          published,
          CourseId,
          author: creator,
        });
        await newC.save();
        coursesAlready.push(newC._id);

        await admin.findOneAndUpdate(
          { username: creator },
          { coursesPublished: coursesAlready }
        );
        console.log(
          `course ${newCourse.CourseId} added and associated with ${creator}`
        );
        resolve({
          message: `course ${newCourse.CourseId} added and associated with ${creator}`,
        });
      }
    } catch (err: any) {
      console.log(`Failed to create course: ${err.message}`);
      reject(`Failed to create course: ${err.message}`);
    }
  });
}
