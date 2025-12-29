"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { PiSunDimFill, PiMoonStarsFill } from "react-icons/pi";
import { useTheme } from "./ThemeProvider";
import styles from "../styles/Header.module.scss";
import Image from "next/image";
const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  let pageTitle;

  if (pathname === "/dashboard") {
    pageTitle = "Dashboard";
  } else if (pathname === "/map") {
    pageTitle = "Map";
  } else if (pathname.startsWith("/meters")) {
    pageTitle = "Meters";
  }
  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  return (
    <header className={styles.header}>
      <div className={styles.title}>
        <h1>{pageTitle}</h1>
        <p>
          {new Date().getDate()}
          {getOrdinalSuffix(new Date().getDate())}{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
      <div>
        <div className={styles.profileContainer}>
          <button className={styles.themeButton} onClick={toggleTheme}>
            {theme === "light" ? (
              <PiMoonStarsFill
                style={{ color: "var(--color-btnText)" }}
                size={24}
              />
            ) : (
              <PiSunDimFill style={{ color: "var(--color-btnBg)" }} size={24} />
            )}
          </button>
          <Image
            src="/ProfilePicturePalasthy small.png"
            width={40}
            height={40}
            alt="profile picture"
            className={styles.profilePic}
          />
          <div className={styles.profileInfo}>
            <h4>Ágnes Kuti-Palásthy</h4>
            <p>Frontend Developer</p>
          </div>
        </div>

        <div></div>
      </div>
    </header>
  );
};

export default Header;
