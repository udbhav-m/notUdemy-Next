import AppBar from "./appbar";
import { useSetRecoilState } from "recoil";
import { appBarState } from "./api/_atoms";
import { Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import styles from "@/styles/landing.module.css";

function Landing() {
  const setAppBar = useSetRecoilState(appBarState);
  setAppBar("LandingAppBar");
  const router = useRouter();
  return (
    <div className="container">
      <AppBar></AppBar>
      <div className={styles.centerData}>
        <div className={styles.leftData}>
          <Typography style={{ marginTop: "5rem" }} variant="h4">
            <b>
              This is not Udemy <i>ofcourse</i>.
            </b>
          </Typography>

          {/* buttonContainer class adds styles from appBar.css */}
          <div className={`${styles.buttonContainer} ${styles.buttons}`}>
            <Button
              onClick={() => {
                router.push("/signin");
              }}
              variant="contained"
            >
              Sign In
            </Button>
            <Button
              onClick={() => {
                router.push("/signUp");
              }}
              variant="contained"
            >
              Sign Up
            </Button>
          </div>
        </div>
        <div className={styles.image}>
          <Typography style={{ marginTop: "5rem" }} variant="h2">
            <b>
              <i>not</i>
            </b>
          </Typography>
          <img
            src="https://logowik.com/content/uploads/images/udemy-new-20212512.jpg"
            alt="logo"
            width="300"
          />
        </div>
      </div>
    </div>
  );
}

export default Landing;
