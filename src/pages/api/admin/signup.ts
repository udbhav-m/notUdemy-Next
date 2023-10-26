import { NextApiRequest, NextApiResponse } from "next";
import { inputvalues, admin, userStructure } from "../_common";

export default async function signupAPI(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      let inputData = inputvalues.safeParse(req.body);
      if (!inputData.success) {
        return res
          .status(411)
          .json({ toast: "error", message: "not a valid input" });
      } else {
        const output = await signup(inputData.data);
        res.send(output);
      }
    }
  } catch (error: any) {
    console.log({ "error at api": error.message });
    res.json({ "error at api": error.message });
  }
}

function signup(input: userStructure) {
  return new Promise(async (resolve, reject) => {
    try {
      let username = input.username;
      let password = input.password;
      let existingAdmin = await admin.findOne({ username });
      if (existingAdmin) {
        console.log(`user: ${username} already exists`);
        resolve({ message: `user ${username} already exists` });
      } else {
        input.coursesPublished = [];
        let coursesPublished = input.coursesPublished;
        let newAdmin = new admin({ username, password, coursesPublished });
        await newAdmin.save();
        console.log(`Account created successfully ${input.username}`);
        resolve({
          success: `Account created successfully`,
          done: true,
        });
      }
    } catch (err: any) {
      console.log(`Account creation failed ${(input.username, err.message)}`);
      reject({
        message: `Account creation failed ${(input.username, err.message)}`,
      });
    }
  });
}
