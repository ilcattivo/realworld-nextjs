import { useEffect } from "react";
import Router from "next/router";
import NProgress from "nprogress";
import { CurrentUserProvider } from "../libs/contexts/currentUser";
import CurrentUserChecker from "../libs/utils/currentUserChecker";
import { CurrentFeedProvider } from "../libs/contexts/currentFeed";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../libs/utils/theme";
import Header from "../components/header";
import "nprogress/nprogress.css";
import "../styles/global.scss";

NProgress.configure({ showSpinner: false });

Router.events.on("routeChangeStart", () => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => {
  NProgress.done();
});
Router.events.on("routeChangeError", () => {
  NProgress.done();
});

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  return (
    <CurrentUserProvider>
      <CurrentUserChecker>
        <CurrentFeedProvider>
          <ThemeProvider theme={theme}>
            <Header />
            <Component {...pageProps} />
          </ThemeProvider>
        </CurrentFeedProvider>
      </CurrentUserChecker>
    </CurrentUserProvider>
  );
}
