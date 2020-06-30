import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { CurrentFeedContext } from "../libs/contexts/currentFeed";
import articleApi from "../libs/api/article";
import Banner from "../components/banner";
import Feed from "../components/feed";

export default function Home() {
  const [feed, setFeed] = useContext(CurrentFeedContext);
  const [articles, setArticles] = useState();
  const [tags, setTags] = useState();
  const router = useRouter();

  const { page, tag } = router.query;

  useEffect(() => {
    setFeed("global");
  }, []);

  useEffect(() => {
    if (!feed) {
      return;
    }

    setArticles(null);

    const method =
      feed === "global"
        ? articleApi.getAllArticles
        : articleApi.getFollowedArticles;

    const fetchArticles = async () => {
      const page = router.query.page || 1;
      const tag = router.query.tag;

      try {
        const [articles, { tags }] = await Promise.all([
          method(page, tag),
          articleApi.getAllTags(),
        ]);
        setArticles(articles);
        setTags(tags);
      } catch (err) {
        setArticles();
        setTags();
      }
    };

    fetchArticles();
  }, [feed, tag, page]);

  return (
    <main>
      <Banner />
      <Feed articles={articles} tags={tags} />
    </main>
  );
}
