import { useContext } from "react";
import Link from "next/link";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import SettingsIcon from "@material-ui/icons/Settings";
import Logo from "./logo";
import { CurrentUserContext } from "../libs/contexts/currentUser";
import { DEFAULT_PROFILE_IMAGE } from "../libs/utils/constants";
import styles from "../styles/header.module.scss";

const useStyles = makeStyles(() => ({
  icon: {
    fontSize: "22px",
    marginRight: "3px",
  },
}));

export default () => {
  const [currentUserState] = useContext(CurrentUserContext);
  const classes = useStyles();
  const userImage =
    (currentUserState.isLoggedIn && currentUserState.currentUser.image) ||
    DEFAULT_PROFILE_IMAGE;

  return (
    <header>
      <div className="container">
        <nav className={styles.nav}>
          <Logo link />
          <ul>
            <li>
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>
            {currentUserState.isLoggedIn && (
              <>
                <li>
                  <Link href="/articles/new">
                    <a>
                      <EditIcon className={classes.icon} />
                      New Post
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/settings">
                    <a>
                      <SettingsIcon className={classes.icon} />
                      Settings
                    </a>
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/profiles/${currentUserState.currentUser.username}`}
                  >
                    <a>
                      <img
                        className={styles.userImage}
                        src={userImage}
                        alt="User avatar"
                      />
                      {currentUserState.currentUser.username}
                    </a>
                  </Link>
                </li>
              </>
            )}
            {!currentUserState.isLoggedIn && (
              <>
                <li>
                  <Link href="/login">
                    <a>Sign in</a>
                  </Link>
                </li>
                <li>
                  <Link href="/signup">
                    <a>Sign up</a>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};
