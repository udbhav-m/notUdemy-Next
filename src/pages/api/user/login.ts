import { NextApiRequest, NextApiResponse } from "next";
import { inputvalues, user, userStructure } from "../_common";
import { ensureDbConnect } from "../_dbConnection";
import { generateKeyforUser } from "../_jwt";

export default async function userLoginAPI(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const inputData = inputvalues.safeParse(req.body);
      if (!inputData.success) {
        console.log({ error: "Invalid input details" });
        return res.json({ error: "Invalid input details" });
      }
      ensureDbConnect();
      const output = await login(inputData.data);
      req.headers.username = inputData.data.username;
      res.json(output);
    }
  } catch (error: any) {
    console.log({ error: error.message });
    res.json({ error: error.message });
  }
}

async function login(input: userStructure) {
  let { username, password } = input;
  return new Promise(async (resolve, reject) => {
    let userExists = await user.findOne({ username, password });
    if (userExists) {
      let token = generateKeyforUser(input);
      console.log(token);
      if (token && typeof token === "string") {
        console.log(
          `Logged-in successfully. welcome ${username}. Token: ${token}`
        );
        resolve({
          toast: "success",
          message: `${username} Logged-In successfully`,
          username: username,
          token: token,
        });
      } else {
        console.log(`Invalid token generated.`);
        reject({ toast: "error", message: `Invalid token generated.` });
      }
    } else {
      console.log(`Username/password Incorrect.`);
      reject({ toast: "error", message: `Username/password Incorrect.` });
    }
  });
}
