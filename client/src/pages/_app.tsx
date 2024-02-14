import type {AppProps} from "next/app";
import "@/styles/globals.scss";
import "react-toastify/ReactToastify.min.css"
import Head from "next/head";
import Providers from "@/components/Providers";

export default function App({Component, pageProps: props}: AppProps){
     return <>
     <Head>
          <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
          <link rel="apple-touch-icon" href="/apple-icon.png" />
          <title>ProgChat | Speak With Coders</title>
     </Head>
     <Providers>
          <Component {...props}/>
     </Providers>
     </>
}