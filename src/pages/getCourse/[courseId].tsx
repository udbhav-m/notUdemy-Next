import { useRecoilState, useSetRecoilState } from "recoil";
import AppBar from "../appbar";
import { appBarState, loadingState } from "../api/_atoms";
import styles from "@/styles/getCourse.module.css";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
// import { baseURL } from "./common";
import { parseCookies } from "nookies";

interface courseStructure {
  title: string;
  description: string;
  price: number;
  imageLink: string;
  published: boolean;
  CourseId: number;
}
interface courseParam {
  courseId: number;
}

function GetCourse() {
  const router = useRouter();
  const setAppBar = useSetRecoilState(appBarState);
  setAppBar("UpdateCourseAppBar");
  const [isLoading, setIsLoading] = useRecoilState(loadingState);
  let { courseId } = router.query as unknown as courseParam;
  const cookies = parseCookies();
  const token = cookies.token;
  const [course, setCourse] = useState<courseStructure>();

  useEffect(() => {
    getCourse();
  }, []);
  async function getCourse() {
    setIsLoading(true);
    const getCAPI = await axios.get(`/api/admin/view/${courseId}`, {
      headers: {
        "Content-Type": "application/json",
        auth: token,
      },
    });
    const res = getCAPI.data;
    setCourse(res);
    console.log(res);
    setIsLoading(false);
  }
  return (
    <>
      <AppBar />
      <div className={styles.getCourseContainer}>
        {isLoading ? (
          <CircularProgress />
        ) : course ? (
          <GetCourseCard
            description={course.description}
            title={course.title}
            CourseId={course.CourseId}
            published={course.published}
            price={course.price}
            imageLink={course.imageLink}
          />
        ) : null}
      </div>
    </>
  );
}

function GetCourseCard(props: courseStructure) {
  return (
    <Card className={styles.getCard}>
      <Typography variant="body2" color="text.secondary">
        <i>
          <b>{props.published}</b>
        </i>
      </Typography>
      <Typography variant="body2">
        <i>
          <b>{props.price}</b>
        </i>
      </Typography>
      <CardMedia
        component="img"
        height="250"
        image={props.imageLink}
        alt="courseImage"
      />
      <CardContent className={styles.cContent}>
        <Typography variant="body2" color="text.secondary">
          {props.CourseId}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          {props.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default GetCourse;
