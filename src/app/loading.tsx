import { BeatLoader } from "react-spinners";
import React from "react";
import styles from "./loading.module.scss";
import { useTranslations } from "next-intl";

export default function Loading() {
  const i18nLoading = useTranslations("loading");
  return (
    <div className={styles.spinnerContainer}>
      <BeatLoader color="var(--color-btnBg)" size={40} speedMultiplier={1} />
      <p>{i18nLoading("loading")}</p>
    </div>
  );
}
