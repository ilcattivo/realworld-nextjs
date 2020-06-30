import { useContext, useEffect, useState } from "react";
import Router from "next/router";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import EditIcon from "@material-ui/icons/Edit";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { CurrentUserContext } from "../../libs/contexts/currentUser";
import { CurrentFeedContext } from "../../libs/contexts/currentFeed";
import useLocalStorage from "../../libs/hooks/useLocalStorage";
import userApi from "../../libs/api/user";
import articleApi from "../../libs/api/article";
import { DEFAULT_PROFILE_IMAGE } from "../../libs/utils/constants";
import MyButton from "../../components/myButton";
import FeedToggler from "../../components/feedToggler";
import FeedList from "../../components/feedList";
import styles from "../../styles/profilePage.module.scss";

export default function ProfilePage({ initialProfile }) {
  const [profile, setProfile] = useState(initialProfile);
  const [currentUserState, dispatch] = useContext(CurrentUserContext);
  const [feed, setFeed] = useContext(CurrentFeedContext);
  const [, setToken] = useLocalStorage("token");
  const [articles, setArticles] = useState();
  const isOwner =
    currentUserState.currentUser?.username === initialProfile.username;

  const { following } = profile;

  useEffect(() => {
    setFeed("user");

    userApi
      .getUserByUsername(profile.username)
      .then((res) => setProfile(res.data.profile));
  }, [initialProfile.username]);

  useEffect(() => {
    if (!feed) {
      return;
    }

    setArticles();

    const method =
      feed === "user"
        ? articleApi.getArticlesByAuthor
        : articleApi.getFavoritedArticles;

    const fetchArticles = async () => {
      const { articles } = await method(profile.username);
      setArticles(articles);
    };

    fetchArticles();
  }, [feed]);

  const tabs = [
    { label: isOwner ? "My Articles" : "User Articles", value: "user" },
    { label: "Favorited Articles", value: "favorited" },
  ];

  const logout = (event) => {
    event.preventDefault();
    setToken("");
    dispatch({ type: "SET_UNAUTHORIZED" });
    Router.push("/");
  };

  const follow = async (event) => {
    event.preventDefault();
    if (!currentUserState.isLoggedIn) {
      Router.push("/login");
      return;
    }

    const method = following ? userApi.unfollow : userApi.follow;

    try {
      setProfile({ ...profile, following: !following });
      await method(profile.username);
    } catch (_) {
      setProfile({ ...profile, following: !following });
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <div className="container">
          <div className={styles.userInfo}>
            <img
              src={profile.image || DEFAULT_PROFILE_IMAGE}
              className={styles.avatar}
              alt="Profile image"
            />
            <h3 className={styles.profileName}>{profile.username}</h3>
            <p>{profile.bio}</p>
          </div>
          <div className={styles.controlButtons}>
            {isOwner ? (
              <>
                <MyButton
                  label="Edit profile"
                  linkTo="/settings"
                  icon={EditIcon}
                >
                  Edit Profile
                </MyButton>
                <MyButton onClick={logout} icon={ExitToAppIcon} color="red">
                  Logout
                </MyButton>
              </>
            ) : (
              <MyButton
                onClick={follow}
                icon={following ? RemoveIcon : AddIcon}
                variant={following ? "contained" : "outlined"}
              >
                {following ? "Unfollow" : "Follow"}
              </MyButton>
            )}
          </div>
        </div>
      </div>
      <div className="container">
        <FeedToggler tabs={tabs} />
        {articles ? (
          <FeedList list={articles} />
        ) : (
          <div className={styles.loader}>Loading...</div>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps = async (context) => {
  let username = context.query.username;

  const { data } = await userApi.getUserByUsername(username);

  return { props: { initialProfile: data.profile } };
};
