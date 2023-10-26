import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import { appBarState, loadingState, addCourseState } from "../api/_atoms";
import AppBar from "../appbar";
import { useEffect, useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import styles from "@/styles/updateCourse.module.css";
import axios from "axios";
import { useRouter } from "next/router";
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

interface props {
  funName?: (id: number) => void;
  CourseId: number;
}
function UpdateCourse(): JSX.Element {
  const router = useRouter();
  const setAppBar = useSetRecoilState(appBarState);
  setAppBar("UpdateCourseAppBar");
  const [isLoading, setIsLoading] = useRecoilState(loadingState);
  let { courseId } = router.query as unknown as courseParam;
  const cookies = parseCookies();
  const token = cookies.token;
  const [course, setCourse] = useState<courseStructure>();
  const { title, description, price, imageLink, published } =
    useRecoilValue(addCourseState);

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

  async function updateCourse() {
    const addAPI = await axios.put(
      `/api/admin/update/${courseId}`,
      {
        title,
        description,
        price,
        imageLink,
        published,
      },
      {
        headers: {
          "Content-Type": "application/json",
          auth: token,
        },
      }
    );
    const data = addAPI.data;
    console.log(data);
    alert(Object.values(data)[0]);
    getCourse();
  }
  return (
    <>
      <AppBar />
      <div className={styles.updateCourseContainer}>
        {isLoading ? (
          <CircularProgress />
        ) : course ? (
          <UpdateCard
            description={course.description}
            title={course.title}
            CourseId={course.CourseId}
            published={course.published}
            price={course.price}
            imageLink={course.imageLink}
          />
        ) : null}
        <UpdateFields
          funName={updateCourse}
          CourseId={courseId ? courseId : 0}
        />
      </div>
    </>
  );
}

function UpdateCard(props: courseStructure) {
  return (
    <Card className={styles.updateCard}>
      <Typography
        className={styles.typoPub}
        variant="body2"
        color="text.secondary"
      >
        <i>
          <b>
            {props.published === true ? <>Published</> : <>Not published</>}
          </b>
        </i>
      </Typography>
      <Typography className={styles.typoPub} variant="body2">
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
      <CardContent>
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

function UpdateFields(props: props) {
  const setUpdateCourseData = useSetRecoilState(addCourseState);
  const { title, description, price, imageLink, published } =
    useRecoilValue(addCourseState);
  return (
    <Card className={styles.updateFieldCard}>
      <Typography variant="h6">
        <b>UPDATE COURSE</b>
      </Typography>
      <TextField
        value={title}
        onChange={(e) =>
          setUpdateCourseData((prevdata) => ({
            ...prevdata,
            title: e.target.value,
          }))
        }
        className={styles.textfieldUpdate}
        variant="outlined"
        label="Title"
        type="text"
      />
      <TextField
        multiline
        value={description}
        onChange={(e) =>
          setUpdateCourseData((prevdata) => ({
            ...prevdata,
            description: e.target.value,
          }))
        }
        className={styles.textfieldUpdate}
        variant="outlined"
        label="Description"
        type="text"
      />
      <TextField
        value={price}
        onChange={(e) =>
          setUpdateCourseData((prevdata) => ({
            ...prevdata,
            price: parseInt(e.target.value),
          }))
        }
        className={styles.textfieldUpdate}
        variant="outlined"
        label="Price"
        type="number"
      />
      <TextField
        value={imageLink}
        onChange={(e) =>
          setUpdateCourseData((prevdata) => ({
            ...prevdata,
            imageLink: e.target.value || prevdata.imageLink,
          }))
        }
        className={styles.textfieldUpdate}
        variant="outlined"
        label="Image Link"
        type="text"
      />

      <FormControlLabel
        label="Publish"
        control={
          <Checkbox
            checked={published}
            onChange={(e) =>
              setUpdateCourseData((prevdata) => ({
                ...prevdata,
                published: e.target.checked,
              }))
            }
          />
        }
      />
      <Button
        onClick={() => {
          props.funName ? props.funName(props.CourseId) : null;
        }}
        variant="contained"
      >
        Update
      </Button>
    </Card>
  );
}

export default UpdateCourse;
