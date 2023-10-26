import { useRecoilValue, useSetRecoilState } from "recoil";
import styles from "@/styles/AddCourse.module.css";
import { appBarState, addCourseState } from "./api/_atoms";
import AppBar from "./appbar";
import {
  Card,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Alert,
  AlertColor,
} from "@mui/material";
import axios from "axios";

import { useState } from "react";
import { parseCookies } from "nookies";

interface AlertData {
  severity: AlertColor;
  message: string;
}
function AddCourse() {
  const setAppBar = useSetRecoilState(appBarState);
  setAppBar("AddCourseAppBar");
  const { title, description, price, imageLink, published } =
    useRecoilValue(addCourseState);
  const cookies = parseCookies();
  const token = cookies.token;
  const [alert, setAlert] = useState<AlertData | null>(null);

  async function addCourse() {
    try {
      const addAPI = await axios.post(
        "/api/admin/addcourse",
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
      if (data.toast) {
        setAlert({ severity: data.toast, message: data.message });

        setTimeout(() => {
          setAlert(null);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <AppBar />
      {alert && (
        <div className={`${styles.toast} ${styles.toast}-${alert.severity}`}>
          <Alert className={styles.toast} severity={alert.severity}>
            {alert.message}
          </Alert>
        </div>
      )}
      <div className={styles.addCourseContainer}>
        <AddCourseCard published={published} funName={addCourse} />
      </div>
    </div>
  );
}

function AddCourseCard(props: {
  published: boolean | undefined;
  funName: () => void;
}) {
  const setAddCourseData = useSetRecoilState(addCourseState);
  return (
    <Card className={styles.addCoursecard}>
      <Typography variant="h6">
        <b>ADD A COURSE</b>
      </Typography>
      <TextField
        onChange={(e) =>
          setAddCourseData((prevdata) => ({
            ...prevdata,
            title: e.target.value,
          }))
        }
        className={styles.textfieldAdd}
        variant="outlined"
        label="Title"
        type="text"
      />
      <TextField
        onChange={(e) =>
          setAddCourseData((prevdata) => ({
            ...prevdata,
            description: e.target.value,
          }))
        }
        className={styles.textfieldAdd}
        variant="outlined"
        label="Description"
        type="text"
      />
      <TextField
        onChange={(e) =>
          setAddCourseData((prevdata) => ({
            ...prevdata,
            price: parseInt(e.target.value),
          }))
        }
        className={styles.textfieldAdd}
        variant="outlined"
        label="Price"
        type="number"
      />
      <TextField
        onChange={(e) =>
          setAddCourseData((prevdata) => ({
            ...prevdata,
            imageLink: e.target.value,
          }))
        }
        className={styles.textfieldAdd}
        variant="outlined"
        label="Image Link"
        type="text"
      />

      <FormControlLabel
        label="Publish"
        control={
          <Checkbox
            checked={props.published}
            onChange={(e) =>
              setAddCourseData((prevdata) => ({
                ...prevdata,
                published: e.target.checked,
              }))
            }
          />
        }
      />
      <Button
        onClick={() => {
          props.funName();
        }}
        variant="contained"
      >
        Add course
      </Button>
    </Card>
  );
}
export default AddCourse;
