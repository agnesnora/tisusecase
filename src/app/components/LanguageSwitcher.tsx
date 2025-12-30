"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import styles from "../styles/LanguageSwitcher.module.scss";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "hu" : "en";

    document.cookie = `locale=${nextLocale}; path=/`;
    router.refresh();
  };

  return (
    <button onClick={toggleLanguage} className={styles.langButton}>
      {locale === "en" ? "HU" : "EN"}
    </button>
  );
}
