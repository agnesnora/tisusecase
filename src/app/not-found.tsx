import Link from "next/link";
import styles from "./not-found.module.scss";
export default function NotFound() {
  return (
    <div className={styles.container}>
      <h2>Sorry, we couldn’t find the page you’re looking for</h2>
      <p>Not found 404</p>
      <Link href="/">Back home</Link>
    </div>
  );
}
