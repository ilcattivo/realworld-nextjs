import { makeStyles } from "@material-ui/core/styles";
import ArticlePreview from "./articlePreview";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      marginBottom: theme.spacing(1),
    },
  },
}));

export default function FeedList({ list }) {
  const classes = useStyles();

  return (
    <ul className={classes.root}>
      {list.map((article) => {
        return <ArticlePreview article={article} key={article.slug} />;
      })}
    </ul>
  );
}
