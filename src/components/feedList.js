import { makeStyles } from "@material-ui/core/styles";
import ArticlePreview from "./articlePreview";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      marginBottom: theme.spacing(1),
    },
  },
  warning: {
    margin: "10px 0 0 20px",
  },
}));

export default function FeedList({ list }) {
  const classes = useStyles();

  return (
    <ul className={classes.root}>
      {list.length > 0 ? (
        list.map((article) => {
          return <ArticlePreview article={article} key={article.slug} />;
        })
      ) : (
        <p className={classes.warning}>There are no articles yet.</p>
      )}
    </ul>
  );
}
