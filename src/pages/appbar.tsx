// import { useState } from 'react';
import { Typography, Button } from "@mui/material";
import styles from "../styles/appbar.module.css";
import { appBarState } from "./api/_atoms";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import Link from "next/link";
import { parseCookies } from "nookies";


function AppBar() {
  const currentAppBar = useRecoilValue(appBarState);
  const cookie = parseCookies();
  const token = cookie.token;
  let returnAppBar;
  switch (currentAppBar) {
    case "LandingAppBar":
      returnAppBar = <LandingAppBar />;
      break;
    case "CourseHomeAppBar":
      returnAppBar = <CourseHomeAppBar />;
      break;
    case "AddCourseAppBar":
      returnAppBar = <AddCourseAppBar />;
      break;

    case "UpdateCourseAppBar":
      returnAppBar = <UpdateCourseAppBar />;
      break;
    case "UserCourseHomeAppBar":
      returnAppBar = <UserCourseHomeAppBar />;
      break;
    case "UserMyCourseAppBar":
      returnAppBar = <UserMyCourseAppBar />;
      break;
    case "UserViewAppBar":
      returnAppBar = <UserViewAppBar />;
      break;

    case null:
      returnAppBar = <>Error</>;
      break;

    default:
      returnAppBar = <>Error</>;
      break;
  }
  return (
    <>
      <div className={styles.appBar}>
        <Link className="link" href={!token ? "/" : ""}>
          <Typography variant="h5">
            <b>
              <i>not</i> Udemy
            </b>
          </Typography>
        </Link>
        {returnAppBar}
      </div>
    </>
  );
}

function LandingAppBar() {
  const router = useRouter();
  return (
    <div className={styles.buttonContainer}>
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
  );
}

function CourseHomeAppBar() {
  const router = useRouter();
  return (
    <div className={styles.buttonContainer}>
      <Button
        onClick={() => {
          router.push("/addCourse");
        }}
        variant="contained"
      >
        Add Course
      </Button>
      <Button
        onClick={() => {
          router.push("/logout");
        }}
        variant="contained"
        color="error"
      >
        Logout
      </Button>
    </div>
  );
}

function AddCourseAppBar() {
  const router = useRouter();
  return (
    <div className={styles.buttonContainer}>
      <Button
        onClick={() => {
          router.push("/courses");
        }}
        variant="contained"
      >
        View Courses
      </Button>
      <Button
        onClick={() => {
          router.push("/logout");
        }}
        variant="contained"
        color="error"
      >
        Logout
      </Button>
    </div>
  );
}

function UpdateCourseAppBar() {
  const router = useRouter();
  return (
    <div className={styles.buttonContainer}>
      <Button
        onClick={() => {
          router.push("/courses");
        }}
        variant="contained"
      >
        View Courses
      </Button>
      <Button
        onClick={() => {
          router.push("/addCourse");
        }}
        variant="contained"
      >
        Add Course
      </Button>
      <Button
        onClick={() => {
          router.push("/logout");
        }}
        variant="contained"
        color="error"
      >
        Logout
      </Button>
    </div>
  );
}

function UserCourseHomeAppBar() {
  const router = useRouter();
  return (
    <div className={styles.buttonContainer}>
      <Button
        onClick={() => {
          router.push("/mycourses");
        }}
        variant="contained"
      >
        My Courses
      </Button>
      <Button
        onClick={() => {
          router.push("/logout");
        }}
        variant="contained"
        color="error"
      >
        Logout
      </Button>
    </div>
  );
}

function UserMyCourseAppBar() {
  const router = useRouter();
  return (
    <div className={styles.buttonContainer}>
      <Button
        onClick={() => {
          router.push("/user/courses");
        }}
        variant="contained"
      >
        View Courses
      </Button>
      <Button
        onClick={() => {
          router.push("/logout");
        }}
        variant="contained"
        color="error"
      >
        Logout
      </Button>
    </div>
  );
}

function UserViewAppBar() {
  const router = useRouter();
  return (
    <div className={styles.buttonContainer}>
      <Button
        onClick={() => {
          router.push("/mycourses");
        }}
        variant="contained"
      >
        My Courses
      </Button>
      <Button
        onClick={() => {
          router.push("/user/courses");
        }}
        variant="contained"
      >
        View Courses
      </Button>
      <Button
        onClick={() => {
          router.push("/logout");
        }}
        variant="contained"
        color="error"
      >
        Logout
      </Button>
    </div>
  );
}
export default AppBar;
