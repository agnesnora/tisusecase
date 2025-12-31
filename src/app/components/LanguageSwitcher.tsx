"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import styles from "../styles/LanguageSwitcher.module.scss";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "hu" : "en";

    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;

    router.refresh();
  };

  return (
    <button onClick={toggleLanguage} className={styles.btn}>
      {locale === "en" ? "HU" : "EN"}
    </button>
  );
}
