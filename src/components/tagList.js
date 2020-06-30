import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import router from "next/router";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.3),
  },
}));

export default ({ tags }) => {
  const classes = useStyles();

  const handleClick = (tag) => () => {
    router.push({
      pathname: "/",
      query: { tag, page: 1 },
    });
  };

  return (
    <ul className={classes.root}>
      {tags.map((tag) => (
        <li key={tag}>
          <Chip
            label={tag}
            className={classes.chip}
            onClick={handleClick(tag)}
          />
        </li>
      ))}
    </ul>
  );
};
