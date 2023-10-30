/* eslint-disable react/prop-types */
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import AppBar from "./commonComponents/appbar";
import {
  adminLoginState,
  appBarState,
  passwordState,
  userLoginState,
  usernameState,
} from "./api/_atoms";
import {
  Card,
  Typography,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import styles from "@/styles/SignUp.module.css";
import axios from "axios";
import { useRouter } from "next/router";

interface propType {
  handleFunction: () => void;
}

function SignUp() {
  const router = useRouter();
  const setAppBar = useSetRecoilState(appBarState);
  setAppBar("LandingAppBar");
  const username = useRecoilValue(usernameState);
  const password = useRecoilValue(passwordState);
  const user = useRecoilValue(userLoginState);
  const admin = useRecoilValue(adminLoginState);

  async function signUp() {
    try {
      let URL: string = "";
      user
        ? (URL = `/api/user/signup`)
        : admin
        ? (URL = `/api/admin/signup`)
        : "";

      const signUpAPI = await axios.post(
        URL,
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
  const setUser = useSetRecoilState(userLoginState);
  const setAdmin = useSetRecoilState(adminLoginState);
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
