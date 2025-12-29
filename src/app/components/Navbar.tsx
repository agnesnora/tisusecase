import React from "react";
import Link from "next/link";
import styles from "../styles/Navbar.module.scss";
import { TbMap2 } from "react-icons/tb";
import { PiGaugeFill } from "react-icons/pi";
import { BiSolidDashboard } from "react-icons/bi";

const Navbar = () => {
  return (
    <div className={styles.container}>
      <h1>Agnesnora<br/>Studio.</h1>
      <nav>
        {" "}
        <Link href="/dashboard">
          {" "}
          <div className={styles.linkContent}>
            <BiSolidDashboard className={styles.icon} />
            <span>Dashboard</span>
          </div>
        </Link>
        <Link href="/map">
          {" "}
          <div className={styles.linkContent}>
            <TbMap2 className={styles.icon} />
            <span>Map</span>
          </div>
        </Link>
        <Link href="/meters">
          {" "}
          <div className={styles.linkContent}>
            <PiGaugeFill className={styles.icon} />
            <span>Meters</span>
          </div>
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;
