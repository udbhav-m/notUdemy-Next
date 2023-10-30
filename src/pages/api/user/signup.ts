import { NextApiRequest, NextApiResponse } from "next";
import { inputvalues, user, userStructure } from "../_common";
import { ensureDbConnect } from "../_dbConnection";

export default async function userSignUpAPI(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      let inputData = inputvalues.safeParse(req.body);
      if (!inputData.success) {
        res.send({ error: "Invalid input details" });
      } else {
        ensureDbConnect();
        let outp = await signup(inputData.data);
        res.send(outp);
      }
    }
  } catch (error: any) {
    res.send({ error: error.message });
  }
}

function signup(input: userStructure) {
  return new Promise(async (resolve, reject) => {
    try {
      let { username, password } = input;
      let existingUser = await user.findOne({ username });
      if (existingUser) {
        console.log(`user: ${username} already exists`);
        resolve({
          toast: "error",
          message: `user ${username} already exists`,
        });
      } else {
        input.coursesPurchased = [];
        let coursesPurchased = input.coursesPurchased;
        let newUser = new user({ username, password, coursesPurchased });
        await newUser.save();
        console.log(`Account created successfully ${input.username}`);
        resolve({
          toast: "success",
          message: `Account created successfully`,
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
