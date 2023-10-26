import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { parseCookies } from "nookies";
const secretKeyForAdmins = "adminsSecretK3Y";
const secretKeyForUser = "usersSecretK3Y";

type userInput = {
  username: string;
  password: string;
};

// Function to generate JWT token
export function generateKey(idPass: userInput, type: "admin" | "user") {
  try {
    let secretKey;
    if (type === "admin") {
      secretKey = secretKeyForAdmins;
    } else {
      secretKey === secretKeyForUser;
    }
    if (secretKey) {
      const payload = { username: idPass.username };
      let token = jwt.sign(payload, secretKey);
      console.log(`token generated`);
      return token;
    }
  } catch (error: any) {
    console.log({ error: error.message });
    return { error: error.message };
  }
}

// Middleware for admin authentication
export const adminAuthentication = (
  req: NextApiRequest,
  res: NextApiResponse,
  callback: () => void
) => {
  const token = req.headers.auth;
  if (token && typeof token === "string") {
    jwt.verify(token, secretKeyForAdmins, (err, user) => {
      if (err) {
        console.log(`JWT verification failed: ${err.message}`);
        res.status(401).json({ error: "JWT Authentication failed" });
      }
      if (!user || user == undefined) {
        console.log(`JWT verification failed`);
        res.status(401).json({ error: "JWT Authentication failed" });
        return console.log({ error: "failed. user is undefined" });
      }
      if (typeof user === "string") {
        res.status(401).json({ error: "JWT Authentication failed" });
        return console.log({ error: "failed. userObj is string" });
      }
      console.log(`Token is valid. welcome ${user.username}`);
      req.headers.username = user.username;
      callback();
    });
  } else {
    res.status(401).json({ error: "Invalid/tampered token" });
  }
};

// Middleware for user authentication
export const userAuthentication = (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const token = req.headers.auth;
  if (token && typeof token === "string") {
    jwt.verify(token, secretKeyForUser, (err, user) => {
      if (err) {
        console.log(`JWT verification failed: ${err.message}`);
        res.status(401).json({ error: "JWT Authentication failed" });
      }
      if (!user || user == undefined) {
        console.log(`JWT verification failed`);
        res.status(401).json({ error: "JWT Authentication failed" });
        return console.log({ error: "failed. user is undefined" });
      }
      if (typeof user === "string") {
        res.status(401).json({ error: "JWT Authentication failed" });
        return console.log({ error: "failed. userObj is string" });
      }
      console.log(`Token is valid. welcome ${user.username}`);
      NextResponse.next();
    });
  } else {
    res.status(401).json({ error: "Invalid/tampered token" });
  }
};
