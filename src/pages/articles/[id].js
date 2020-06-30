import { useContext } from "react";
import { CurrentUserContext } from "../../libs/contexts/currentUser";
import ArticleApi from "../../libs/api/article";
import ArticleBanner from "../../components/articleBanner";
import TagList from "../../components/tagList";
import styles from "../../styles/article.module.scss";

export default ({ article }) => {
  const [currentUserState] = useContext(CurrentUserContext);

  if (!article) {
    return (
      <div className="container">
        <h1>Article not found</h1>
      </div>
    );
  }

  const isAuthor = () => {
    if (!currentUserState.isLoggedIn) {
      return false;
    }

    return currentUserState.currentUser.username === article.author.username;
  };

  return (
    <main>
      <ArticleBanner article={article} isAuthor={isAuthor()} />
      <div className={styles.body}>
        <div className="container">
          <p className={styles.content}>{article.body}</p>
          <TagList tags={article.tagList} />
        </div>
      </div>
    </main>
  );
};

export const getServerSideProps = async (context) => {
  const id = context.params.id;
  try {
    const article = await ArticleApi.getArticleById(id);
    return { props: { article } };
  } catch (err) {
    return { props: {} };
  }
};
