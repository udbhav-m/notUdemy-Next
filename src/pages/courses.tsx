import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { appBarState, coursesState, loadingState } from "./atoms";
import AppBar from "./appbar";
import styles from "@/styles/Courses.module.css";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";
import { useEffect } from "react";
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

interface props extends courseStructure {
  delFunction: (id: number) => void;
  onClickHandle: any;
}
function Courses() {
  const setAppBar = useSetRecoilState(appBarState);
  setAppBar("CourseHomeAppBar");
  const cookies = parseCookies();
  const token = cookies.token;
  const courseList: courseStructure[] = useRecoilValue(coursesState);
  const setCourses = useSetRecoilState(coursesState);
  const [isLoading, setIsLoading] = useRecoilState(loadingState);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    getCourses();
    setIsLoading(false);
  }, []);

  async function getCourses() {
    try {
      const getAPi = await axios.get(`/api/admin/courses`, {
        headers: {
          "Content-Type": "application/json",
          auth: token,
        },
      });
      const res = getAPi.data;
      console.log(res);
      setCourses(res);
      console.log("loading");
    } catch (error: any) {
      console.log(error.message);
    }
  }
  async function deleteById(Id: number) {
    try {
      console.log(Id);
      const delAPI = await axios.delete(`/admin/courses/${Id}`, {
        headers: {
          "Content-type": "application/json",
          auth: token,
        },
      });
      console.log(delAPI.data);
      getCourses();
    } catch (err: any) {
      console.log(err.message);
    }
  }

  return (
    <>
      <AppBar />
      <div className={styles.courseCardContainer}>
        {isLoading ? (
          <CircularProgress disableShrink />
        ) : (
          courseList.map((each) => {
            const handle = () => {
              let CourseId = each.CourseId
              router.push(`/getCourse/${CourseId}`);
            };
            return (
              <CourseCard
                key={each.CourseId}
                title={each.title}
                description={each.description}
                imageLink={each.imageLink}
                published={each.published}
                CourseId={each.CourseId}
                price={each.price}
                delFunction={deleteById}
                onClickHandle={handle}
              />
            );
          })
        )}
      </div>
    </>
  );
}

export function CourseCard(props: props) {
  const router = useRouter();
  return (
    <Card className={styles.CourseCard} sx={{ width: 400 }}>
      <CardActionArea onClick={props.onClickHandle}>
        <Typography style={{ padding: "1rem" }} variant="body2">
          <i>
            <b>${props.price}</b>
          </i>
        </Typography>
        <Typography
          style={{ padding: "1rem" }}
          variant="body2"
          color="text.secondary"
        >
          <i>
            <b>{props.published ? "published" : "not published"}</b>
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
            className="description"
            variant="body2"
            color="text.secondary"
          >
            {props.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          onClick={() => router.push(`/updateCourse/${props.CourseId}`)}
          size="small"
          color="primary"
        >
          <b>Edit</b>
        </Button>
        <Button
          onClick={() => props.delFunction(props.CourseId)}
          size="small"
          color="error"
        >
          <b>Delete</b>
        </Button>
      </CardActions>
    </Card>
  );
}

export default Courses;
