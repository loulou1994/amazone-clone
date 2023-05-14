import dynamic from "next/dynamic";
import { AppProvider } from "../context/appContext";
import { SnackbarProvider } from "notistack";

import localFont from "@next/font/local";
import "../styles/globals.css";

const myFont = localFont({
  src: [
    {
      path: "../public/fonts/amazon-ember/AmazonEmber_Rg.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/amazon-ember/AmazonEmber_Bd.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/amazon-ember/AmazonEmber_He.ttf",
      weight: "900",
      style: "normal",
    },
  ],
});
function MyApp({ Component, pageProps }) {
  return (
      <AppProvider>
        <SnackbarProvider>
          <style jsx global>{`
            :root {
              --ff-primary: ${myFont.style.fontFamily};
            }
          `}</style>
          <Component {...pageProps} />
        </SnackbarProvider>
      </AppProvider>
  );
}
export default MyApp;