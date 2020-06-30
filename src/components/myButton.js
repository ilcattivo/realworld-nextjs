import Link from "next/link";
import styles from "../styles/myButton.module.scss";

export default function MyButton({
  children: label,
  linkTo,
  color = "grey",
  variant = "outlined",
  icon: Icon,
  onClick,
}) {
  const iconStyles = {
    fontSize: 22,
    verticalAlign: "middle",
    margin: "-3 2 0 0",
  };

  let clazz = color;
  if (variant === "contained") clazz = color + "Contained";

  if (linkTo) {
    return (
      <Link href={linkTo}>
        <a className={styles[clazz]}>
          {Icon && <Icon style={iconStyles} />}
          {label}
        </a>
      </Link>
    );
  } else {
    return (
      <button onClick={onClick} className={styles[clazz]}>
        {Icon && <Icon style={iconStyles} />}
        {label}
      </button>
    );
  }
}
