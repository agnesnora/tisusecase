import { MeterType } from "@/schemas/meters";
import { ReadingType } from "@/schemas/readings";
import { orderReadingsDesc } from "./dateOrderHelper";
export const combineMetersWithLatestReading = (
  meters: MeterType[],
  readings: ReadingType[]
) => {
  return meters.map((meter) => {
    //filtering readings for meterids
    const meterReadings = readings.filter(
      (reading) => reading.meterId === meter.id
    );

    const sortedReadings = [...meterReadings].sort(orderReadingsDesc);

    const latestReading = sortedReadings[0] || null;

    return {
      ...meter,
      latestReading,
    };
  });
};
