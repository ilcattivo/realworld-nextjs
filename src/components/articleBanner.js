import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import articleApi from "../libs/api/article";
import { DEFAULT_PROFILE_IMAGE } from "../libs/utils/constants";
import MyButton from "./myButton";
import styles from "../styles/articleBanner.module.scss";

export default function ArticleBanner({ article, isAuthor }) {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const articleId = router.query.id;

  const userImage = article.author.image || DEFAULT_PROFILE_IMAGE;

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const handleDelete = async () => {
    setModalOpen(false);
    await articleApi.deleteArticle(article.slug);
    router.push("/");
  };

  return (
    <div className={styles.banner}>
      <div className="container">
        <h1 className={styles.title}>{article.title}</h1>
        <div className={styles.meta}>
          <Link href={`/${article.author.username}`}>
            <a className={styles.userImg}>
              <img src={userImage} alt="user logo" />
            </a>
          </Link>
          <div className={styles.info}>
            <Link href={`/profiles/${article.author.username}`}>
              <a className={styles.author}>{article.author.username}</a>
            </Link>
            <span className={styles.date}>{article.createdAt}</span>
          </div>
          {isAuthor && (
            <div className={styles.buttons}>
              <MyButton linkTo={`/articles/${articleId}/edit`} icon={EditIcon}>
                Edit
              </MyButton>
              <MyButton
                icon={DeleteForeverIcon}
                color="red"
                onClick={handleModalOpen}
              >
                Delete
              </MyButton>
            </div>
          )}
        </div>
        <Dialog
          open={modalOpen}
          onClose={handleCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Delete article</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you shure you want to delete article {article.title}? This
              action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="primary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
