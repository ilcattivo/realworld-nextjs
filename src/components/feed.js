import { useContext } from "react";
import FeedToggler from "./feedToggler";
import FeedList from "./feedList";
import styles from "../styles/feed.module.scss";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import { CurrentUserContext } from "../libs/contexts/currentUser";
import { ARTICLES_PER_PAGE } from "../libs/utils/constants";
import router, { useRouter } from "next/router";
import TagList from "./tagList";

const useStyles = makeStyles((theme) => ({
  loader: {
    marginTop: "10px",
    marginLeft: "20px",
  },
  tagsBlock: {
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#efefef",
    boxShadow: "0 0 20px 5px rgba(0,0,0,0.4);",
  },
  pagination: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

export default ({ articles, tags }) => {
  const [currentUser] = useContext(CurrentUserContext);
  const { query } = useRouter();
  const defaultPage = +query.page || 1;
  const pageCounts = articles
    ? Math.ceil(articles.articlesCount / ARTICLES_PER_PAGE)
    : 0;
  const classes = useStyles();

  const tabs = [{ label: "Global Feed", value: "global" }];

  if (currentUser.isLoggedIn) {
    tabs.push({ label: "My Feed", value: "subs" });
  }

  const handlePageChange = (_, page) => {
    router.push({
      pathname: "/",
      query: { ...query, page },
    });
  };

  return (
    <section>
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.left}>
            <FeedToggler tabs={tabs} />
            {articles ? (
              <FeedList list={articles.articles} />
            ) : (
              <div className={classes.loader}>Loading...</div>
            )}
            <Pagination
              page={defaultPage}
              className={classes.pagination}
              count={pageCounts}
              color="primary"
              onChange={handlePageChange}
            />
          </div>
          <div className={styles.right}>
            <div className={classes.tagsBlock}>
              {tags ? <TagList tags={tags} /> : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
