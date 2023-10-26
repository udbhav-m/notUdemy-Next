/* eslint-disable react/prop-types */
import { useRecoilValue, useSetRecoilState } from "recoil";
import AppBar from "./appbar";
import { appBarState, passwordState, usernameState } from "./atoms";
import { Card, Typography, TextField, Button } from "@mui/material";
import styles from "@/styles/SignUp.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import { ensureDbConnected } from "./api/_db";


interface propType {
  handleFunction: () => void;
}

function SignUp() {
  const router = useRouter();
  const setAppBar = useSetRecoilState(appBarState);
  setAppBar("LandingAppBar");
  const username = useRecoilValue(usernameState);
  const password = useRecoilValue(passwordState);

  async function signUp() {
    try {
      const signUpAPI = await axios.post(
        `/api/admin/signup`,
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res = signUpAPI.data;
      console.log(res);
      alert(Object.values(res)[0]);
      if (res.done) {
        router.push("/signin");
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }

  return (
    <div>
      <AppBar></AppBar>
      <div className={styles.signUpContainer}>
        <SignUpCard handleFunction={signUp} />
      </div>
    </div>
  );
}

function SignUpCard(props: propType) {
  const setUsername = useSetRecoilState(usernameState);
  const setPassword = useSetRecoilState(passwordState);
  return (
    <Card className={styles.signUpCard}>
      <Typography variant="h6">
        <b>Create an account!</b>
      </Typography>
      <TextField
        onChange={(e) => setUsername(e.target.value)}
        className={styles.textfieldUp}
        variant="outlined"
        label="Username"
        type="text"
      />
      <TextField
        onChange={(e) => setPassword(e.target.value)}
        className={styles.textfieldUp}
        variant="outlined"
        label="Password"
        type="password"
      />
      <Button
        onClick={() => {
          props.handleFunction();
        }}
        variant="contained"
      >
        Sign Up
      </Button>
    </Card>
  );
}

export default SignUp;
