import MeterDetailsClient from "@/app/components/MeterDetailsClient";
import { fetchMeterById } from "@/utils/api/meters";
import styles from "./page.module.scss";
import { notFound } from "next/navigation";
export default async function MeterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    notFound();
  }
  const meter = await fetchMeterById(id);
  if (!meter) {
    notFound();
  }
  return (
    <div className={styles.container}>
      <MeterDetailsClient meter={meter} />
    </div>
  );
}
