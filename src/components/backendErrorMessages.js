import React from "react";
import styles from "../styles/backendErrorMessages.module.scss";

const BackendErrorMessages = ({ backendErrors }) => {
  const errorMessages = Object.keys(backendErrors).map((name) => {
    const messages = backendErrors[name].join(" ");
    return `${name} ${messages}`;
  });
  return (
    <ul className={styles.list}>
      {errorMessages.map((errorMessage) => {
        return <li key={errorMessage}>{errorMessage}</li>;
      })}
    </ul>
  );
};

export default BackendErrorMessages;
