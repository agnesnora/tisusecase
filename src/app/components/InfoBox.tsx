import React from "react";
import styles from "../styles/InfoBox.module.scss";

interface InfoBoxProps {
  variant: "average" | "highest" | "lowest";
  title: string;
  subtitle: string | number;
  value?: string;
}
export const InfoBox = ({ variant, title, subtitle, value }: InfoBoxProps) => {
  return (
    <div className={styles[variant]}>
      <h3>{title}</h3>
      <p className={styles.subtitle}>{subtitle}</p>
      {value ? <p>{value}</p> : null}
    </div>
  );
};
