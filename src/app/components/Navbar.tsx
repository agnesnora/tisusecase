import React from "react";
import Link from "next/link";
import styles from "../styles/Navbar.module.scss";
import { TbMap2 } from "react-icons/tb";
import { PiGaugeFill } from "react-icons/pi";
import { BiSolidDashboard } from "react-icons/bi";
import { useTranslations } from "next-intl";

const Navbar = () => {
  const t = useTranslations("navigation");
  return (
    <div className={styles.container}>
      <h1>
        Agnesnora
        <br />
        Studio.
      </h1>
      <nav>
        {" "}
        <Link href="/dashboard">
          <div className={styles.linkContent}>
            <BiSolidDashboard className={styles.icon} />
            <span>{t("dashboard")}</span>
          </div>
        </Link>
        <Link href="/map">
          <div className={styles.linkContent}>
            <TbMap2 className={styles.icon} />
            <span>{t("map")}</span>
          </div>
        </Link>
        <Link href="/meters">
          <div className={styles.linkContent}>
            <PiGaugeFill className={styles.icon} />
            <span>{t("meters")}</span>
          </div>
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;
