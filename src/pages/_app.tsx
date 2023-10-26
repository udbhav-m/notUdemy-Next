import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import "@/styles/globals.css";
import { connectDB } from "./api/_dbConnection";

export default function App({ Component, pageProps }: AppProps) {
  connectDB();
  return (
    <SessionProvider session={pageProps.session}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </SessionProvider>
  );
}
