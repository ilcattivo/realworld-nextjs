import Link from "next/link";
import styles from "../styles/logo.module.scss";

export default ({ link }) => {
  const template = (
    <div className={styles.logo}>
      <img src="/medium_logo.svg" alt="Medium logo" />
      <span className={styles.label}>edium</span>
    </div>
  );

  if (link) {
    return (
      <Link href="/">
        <a style={{ textDecoration: "none" }}>{template}</a>
      </Link>
    );
  } else {
    return template;
  }
};
