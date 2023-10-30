import { useSetRecoilState } from "recoil";
import { appBarState } from "./api/_atoms";
import AppBar from "./commonComponents/appbar";
import { LinearProgress, Typography } from "@mui/material";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { destroyCookie } from "nookies";

function Logout() {
  const router = useRouter();
  const setAppBar = useSetRecoilState(appBarState);
  setAppBar("LandingAppBar");
  destroyCookie(null, "token");
  useEffect(() => {
    setTimeout(() => router.push("/"), 1500);
  });
  return (
    <>
      <AppBar />
      <LinearProgress />
      <div>
        <center>
          <Typography style={{ marginTop: "10rem" }} variant="h5">
            <b>Redirecting...</b>
          </Typography>
        </center>
      </div>
    </>
  );
}

export default Logout;
