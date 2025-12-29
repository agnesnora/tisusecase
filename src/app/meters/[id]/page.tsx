import { fetchMeterById } from "@/utils/api/meters";
import MeterDetailsClient from "@/app/components/MeterDetailsClient";
import styles from "./page.module.scss";
export default async function MeterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const meter = await fetchMeterById(id);

  return (
    <div className={styles.container}>
      <MeterDetailsClient meter={meter} />
    </div>
  );
}
