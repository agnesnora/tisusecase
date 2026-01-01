"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { PiMoonStarsFill, PiSunDimFill } from "react-icons/pi";
import styles from "../styles/Header.module.scss";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTheme } from "./ThemeProvider";
const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const i18nNav = useTranslations("navigation");
  let pageTitle;

  if (pathname === "/dashboard") {
    pageTitle = i18nNav("dashboard");
  } else if (pathname === "/map") {
    pageTitle = i18nNav("map");
  } else if (pathname.startsWith("/meters")) {
    pageTitle = i18nNav("meters");
  }

  return (
    <header className={styles.header}>
      <div className={styles.title}>
        <h1>{pageTitle}</h1>
      </div>
      <div>
        <div className={styles.profileContainer}>
          <LanguageSwitcher />
          <button className={styles.btn} onClick={toggleTheme}>
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
