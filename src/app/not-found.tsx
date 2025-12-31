import Link from "next/link";
import { useTranslations } from "next-intl";
import styles from "./not-found.module.scss";
export default function NotFound() {
  const i18nNf = useTranslations("not-found");
  return (
    <div className={styles.container}>
      <h2>{i18nNf("title")}</h2>
      <p>{i18nNf("message")}</p>
      <Link href="/">{i18nNf("back-home")}</Link>
    </div>
  );
}
