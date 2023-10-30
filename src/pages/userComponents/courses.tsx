import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import AppBar from "../commonComponents/appbar";
import { appBarState, coursesState, loadingState } from "../api/_atoms";
import axios from "axios";
import { useEffect } from "react";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  LinearProgress,
  Typography,
} from "@mui/material";
import style from "@/styles/coursesUser.module.css";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";

interface courseStructure {
  title: string;
  description: string;
  price: number;
  imageLink: string;
  CourseId: number;
}

interface props extends courseStructure {
  purchaseFunction: (CourseId: number) => void;
}

function UserCourse() {
  const setAppBar = useSetRecoilState(appBarState);
  setAppBar("UserCourseHomeAppBar");
  const cookies = parseCookies();
  const token = cookies.token;
  const [loading, setLoading] = useRecoilState(loadingState);
  const publishedCourses: courseStructure[] = useRecoilValue(coursesState);
  const setPublishedCourses = useSetRecoilState(coursesState);

  async function userCourses() {
    try {
      setLoading(true);
      const getAPI = await axios.get(`/api/user/courses`, {
        headers: {
          "Content-Type": "application/json",
          auth: token,
        },
      });

      setPublishedCourses(getAPI.data);
      setLoading(false);
    } catch (err: any) {
      console.log(err.message);
    }
  }

  async function purchaseCourse(CourseId: number) {
    try {
      setLoading(true);
      const purchaseAPI = await axios.post(
        `/api/user/purchase/${CourseId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            auth: token,
          },
        }
      );
      setLoading(false);
      window.alert(purchaseAPI.data.message);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    userCourses();
  }, []);

  return (
    <>
      <AppBar />
      <div className={style.userCourseCardContainer}>
        {loading ? (
          <LinearProgress />
        ) : publishedCourses ? (
          publishedCourses.map((each) => {
            return (
              <UserCourseCard
                key={each.CourseId}
                title={each.title}
                description={each.description}
                imageLink={each.imageLink}
                CourseId={each.CourseId}
                price={each.price}
                purchaseFunction={purchaseCourse}
              />
            );
          })
        ) : null}
      </div>
    </>
  );
}

function UserCourseCard(props: props) {
  const router = useRouter();
  const loading = useRecoilValue(loadingState);
  return (
    <Card className={style.CourseCard} sx={{ width: 400 }}>
      <CardActionArea
        onClick={() => router.push(`/userComponents/view/${props.CourseId}`)}
      >
        <Typography style={{ padding: "1rem" }} variant="body2">
          <i>
            <b>${props.price}</b>
          </i>
        </Typography>
        <CardMedia
          component="img"
          height="250"
          image={props.imageLink}
          alt="courseImage"
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {props.CourseId}
          </Typography>
          <Typography gutterBottom variant="h5" component="div">
            {props.title}
          </Typography>
          <Typography
            className={style.userDescription}
            variant="body2"
            color="text.secondary"
          >
            {props.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          onClick={() =>
            loading ? (
              <LinearProgress />
            ) : (
              props.purchaseFunction(props.CourseId)
            )
          }
          size="small"
          color="primary"
        >
          <b>Purchase</b>
        </Button>
      </CardActions>
    </Card>
  );
}

export default UserCourse;
