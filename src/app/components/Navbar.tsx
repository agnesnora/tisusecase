"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiSolidDashboard } from "react-icons/bi";
import { PiGaugeFill } from "react-icons/pi";
import { TbMap2 } from "react-icons/tb";
import styles from "../styles/Navbar.module.scss";

const Navbar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path);
  return (
    <div className={styles.container}>
      <Link href="/">
        <h1>
          Agnesnora
          <br />
          Studio.
        </h1>
      </Link>
      <nav>
        {" "}
        <Link href="/dashboard">
          <div
            className={`${styles.linkContent} ${
              isActive("/dashboard") ? styles.active : ""
            }`}
          >
            <BiSolidDashboard className={styles.icon} />
            <span>Dashboard</span>
          </div>
        </Link>
        <Link href="/map">
          <div
            className={`${styles.linkContent} ${
              isActive("/map") ? styles.active : ""
            }`}
          >
            <TbMap2 className={styles.icon} />
            <span>Map</span>
          </div>
        </Link>
        <Link href="/meters">
          <div
            className={`${styles.linkContent} ${
              isActive("/meters") ? styles.active : ""
            }`}
          >
            <PiGaugeFill className={styles.icon} />
            <span>Meters</span>
          </div>
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;
