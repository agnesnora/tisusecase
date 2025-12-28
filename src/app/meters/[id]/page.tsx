import { fetchMeterById } from "@/utils/api/meters";
import MeterDetailsClient from "@/app/components/MeterDetailsClient";

export default async function MeterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const meter = await fetchMeterById(id);

  return <MeterDetailsClient meter={meter} />;
}
