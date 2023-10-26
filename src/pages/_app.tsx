import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import "@/styles/globals.css";
import { ensureDbConnect } from "./api/_dbConnection";

export default function App({ Component, pageProps }: AppProps) {
  ensureDbConnect();
  return (
    <SessionProvider session={pageProps.session}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </SessionProvider>
  );
}
