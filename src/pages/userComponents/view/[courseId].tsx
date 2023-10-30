import { useRecoilState, useSetRecoilState } from "recoil";
import AppBar from "../../commonComponents/appbar";
import { appBarState, loadingState } from "../../api/_atoms";
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import style from "@/styles/myCourses.module.css";
import { parseCookies } from "nookies";

interface courseStructure {
  title: string;
  description: string;
  price: number;
  imageLink: string;
  CourseId: number;
}

interface courseParam {
  courseId: number;
}
function ViewCourse() {
  const router = useRouter();
  const setAppBar = useSetRecoilState(appBarState);
  setAppBar("UserViewAppBar");
  const [loading, setLoading] = useRecoilState(loadingState);
  const [course, setCourse] = useState<courseStructure>();
  const cookies = parseCookies();
  const token = cookies.token;
  let { courseId } = router.query as unknown as courseParam;

  async function getCourse() {
    try {
      setLoading(true);
      const getAPI = await axios.get(`/api/user/view/${courseId}`, {
        headers: {
          "Content-Type": "application/json",
          auth: token,
        },
      });
      setCourse(getAPI.data);
      if (getAPI.data) {
        setLoading(false);
        console.log(getAPI.data);
      }
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    getCourse();
  }, []);

  return (
    <>
      <AppBar />
      <div className={style.userPurchasedContainer}>
        {loading ? (
          <LinearProgress />
        ) : course ? (
          <GetCourseCard
            description={course.description}
            title={course.title}
            CourseId={course.CourseId}
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
    <Card className="getCard">
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
      <CardContent className="cContent">
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

export default ViewCourse;
