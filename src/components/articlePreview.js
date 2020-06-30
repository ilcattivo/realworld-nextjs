import { useState, useContext } from "react";
import Link from "next/link";
import Router from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import { CurrentUserContext } from "../libs/contexts/currentUser";
import { DEFAULT_PROFILE_IMAGE } from "../libs/utils/constants";
import formatDate from "../libs/utils/formatDate";
import articleApi from "../libs/api/article";
import TagList from "./tagList";

const useStyles = makeStyles(() => ({
  card: {
    boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2)",
  },
  avatar: {
    cursor: "pointer",
  },
  button: {
    textTransform: "none",
  },
  tags: {
    float: "right",
    padding: 0,
  },
}));

export default function ArticlePreview({ article }) {
  const classes = useStyles();
  const [currentUser] = useContext(CurrentUserContext);
  const [preview, setPreview] = useState(article);

  const {
    author: { username, image },
    slug,
    favorited,
    favoritesCount,
    createdAt,
    title,
    description,
    tagList,
  } = preview;

  const handleFavorite = (slug) => () => {
    if (!currentUser.isLoggedIn) {
      Router.push("/login");
      return;
    }

    setPreview({
      ...preview,
      favorited: !favorited,
      favoritesCount: favorited ? favoritesCount - 1 : favoritesCount + 1,
    });
    const method = favorited
      ? articleApi.removeFromFavorite
      : articleApi.addToFavorite;

    try {
      method(slug);
    } catch (err) {
      setPreview({
        ...preview,
        favorited: !favorited,
        favoritesCount: favorited ? favoritesCount - 1 : favoritesCount + 1,
      });
    }
  };

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Link href={`/profiles/${username}`}>
            <Avatar
              src={image || DEFAULT_PROFILE_IMAGE}
              alt="User avatar"
              className={classes.avatar}
            />
          </Link>
        }
        action={
          <IconButton
            aria-label="add to favorites"
            onClick={handleFavorite(slug)}
          >
            {favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            <span style={{ fontSize: 18 }}>{favoritesCount}</span>
          </IconButton>
        }
        title={
          <Link href={`/profiles/${username}`}>
            <a>{username}</a>
          </Link>
        }
        subheader={formatDate(createdAt)}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="h3">
          <Link href={`/articles/${slug}`}>
            <a>{title}</a>
          </Link>
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button className={classes.button} size="small">
          <Link href={`/articles/${slug}`}>
            <a>Read more</a>
          </Link>
        </Button>
      </CardActions>
      <CardActions className={classes.tags}>
        {tagList.length > 0 && <TagList tags={tagList} />}
      </CardActions>
    </Card>
  );
}
