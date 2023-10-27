import { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import "@/styles/globals.css";
import { ensureDbConnect } from "./api/_dbConnection";

export default function App({ Component, pageProps }: AppProps) {
  ensureDbConnect();
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}
