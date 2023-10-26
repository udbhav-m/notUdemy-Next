/* eslint-disable react/prop-types */
import styles from "../styles/signIn.module.css";
import AppBar from "./appbar";
import {
  Card,
  TextField,
  Button,
  Typography,
  FormControl,
  RadioGroup,
  FormLabel,
  FormControlLabel,
  Radio,
} from "@mui/material";
import {
  appBarState,
  passwordState,
  usernameState,
  userLoginState,
  adminLoginState,
} from "./atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";
import axios from "axios";
import { useRouter } from "next/router";
// import { baseURL } from "./common";
import { setCookie } from "nookies";
import { ensureDbConnected } from "./api/_db";

interface signInProps {
  funName: () => void;
}
function SignIn() {
  ensureDbConnected()
  const router = useRouter();
  const setAppBar = useSetRecoilState(appBarState);
  setAppBar("LandingAppBar");
  const username = useRecoilValue(usernameState);
  const password = useRecoilValue(passwordState);
  const userLogin = useRecoilValue(userLoginState);
  const adminLogin = useRecoilValue(adminLoginState);

  async function signin() {
    try {
      let URL: string = "";
      userLogin
        ? (URL = `/api/user/login`)
        : adminLogin
        ? (URL = `/api/admin/login`)
        : "";
      const signInAPI = await axios.post(
        URL,
        {
          username,
          password,
        },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const res = signInAPI.data;
      console.log(res);
      if (res.token) {
        setCookie(null, "token", res.token, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: "/",
        });
      }

      if (res.token && adminLogin) {
        router.push("/courses");
      } else {
        if (res.token && userLogin) {
          router.push("/user/courses");
        }
      }
    } catch (error: any) {
      console.log(error.message);
      alert(error.message);
    }
  }
  return (
    <div>
      <AppBar />
      <div className={styles.signInContainer}>
        <SignInCard funName={signin} />
      </div>
    </div>
  );
}

function SignInCard(props: signInProps) {
  const setUsername = useSetRecoilState(usernameState);
  const setPassword = useSetRecoilState(passwordState);
  const setUser = useSetRecoilState(userLoginState);
  const setAdmin = useSetRecoilState(adminLoginState);
  return (
    <Card className={styles.signInCard}>
      <Typography variant="h6">
        <b>Welcome back!</b>
      </Typography>
      <TextField
        onChange={(e) => setUsername(e.target.value)}
        className="textfieldIn"
        variant="outlined"
        label="Username"
        type="text"
      />
      <TextField
        onChange={(e) => setPassword(e.target.value)}
        className="textfieldIn"
        variant="outlined"
        label="Password"
        type="password"
      />

      <FormControl>
        <FormLabel id="demo-row-radio-buttons-group-label">Type</FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
        >
          <FormControlLabel
            value="user"
            control={
              <Radio
                onChange={() => {
                  setUser(true);
                  setAdmin(false);
                }}
              />
            }
            label="User "
          />
          <FormControlLabel
            value="admin"
            control={
              <Radio
                onChange={() => {
                  setAdmin(true);
                  setUser(false);
                }}
              />
            }
            label="Admin"
          />
        </RadioGroup>
      </FormControl>
      <Button onClick={() => props.funName()} variant="contained">
        Sign In
      </Button>
    </Card>
  );
}

export default SignIn;
