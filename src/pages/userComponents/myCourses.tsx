import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import AppBar from "../commonComponents/appbar";
import { appBarState, coursesState, loadingState } from "../api/_atoms";
import axios from "axios";
import { useEffect } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  LinearProgress,
  Typography,
} from "@mui/material";
import style from "@/styles/myCourses.module.css";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";

interface courseStructure {
  title: string;
  description: string;
  price: number;
  imageLink: string;
  CourseId: number;
}

function MyCourses() {
  const setAppBar = useSetRecoilState(appBarState);
  setAppBar("UserMyCourseAppBar");
  const [loading, setLoading] = useRecoilState(loadingState);
  const cookies = parseCookies();
  const token = cookies.token;
  const purchasedCourses: courseStructure[] = useRecoilValue(coursesState);
  const setpurchasedCourses = useSetRecoilState(coursesState);

  async function myCourses() {
    try {
      setLoading(true);
      const myAPI = await axios.get(`/api/user/myCourses`, {
        headers: {
          "Content-Type": "application/json",
          auth: token,
        },
      });
      setpurchasedCourses(myAPI.data);
      if (purchasedCourses) {
        setLoading(false);
      } else {
        setLoading(false);
        console.log("You have no courses");
        window.alert("You have no courses");
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    myCourses();
  }, []);

  return (
    <>
      <AppBar />
      <div className={style.userPurchasedContainer}>
        {loading ? (
          <LinearProgress />
        ) : purchasedCourses ? (
          purchasedCourses.map((each) => {
            return (
              <UserCourseCard
                key={each.CourseId}
                title={each.title}
                description={each.description}
                imageLink={each.imageLink}
                CourseId={each.CourseId}
                price={each.price}
              />
            );
          })
        ) : null}
      </div>
    </>
  );
}

function UserCourseCard(props: courseStructure) {
  const router = useRouter();
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
    </Card>
  );
}

export default MyCourses;
