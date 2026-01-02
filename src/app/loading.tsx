import { BeatLoader } from "react-spinners";
import React from "react";
import styles from "./loading.module.scss";

export default function Loading() {
  return (
    <div className={styles.spinnerContainer}>
      <BeatLoader color="var(--color-btnBg)" size={40} speedMultiplier={1} />
      <p>Loading...</p>
    </div>
  );
}
