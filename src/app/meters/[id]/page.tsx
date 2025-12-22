import { fetchMeterById } from "@/utils/api/meters";
import { fetchReadingsByMeterId } from "@/utils/api/readings";
import MeterDetailsClient from "@/app/components/MeterDetailsClient";

export default async function MeterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [meter, readings] = await Promise.all([
    fetchMeterById(id),
    fetchReadingsByMeterId(id),
  ]);

  return <MeterDetailsClient meter={meter} readings={readings} />;
}
