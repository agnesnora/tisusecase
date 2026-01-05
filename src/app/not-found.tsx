import Link from "next/link";
import styles from "./not-found.module.scss";
import { useTranslations } from "next-intl";
export default function NotFound() {
  const i18nNotFound = useTranslations("notFound");
  return (
    <div className={styles.container}>
      <h2>{i18nNotFound("title")}</h2>
      <p>{i18nNotFound("error")}</p>
      <Link href="/">{i18nNotFound("home")}</Link>
    </div>
  );
}
