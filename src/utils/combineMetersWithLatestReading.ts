import { MeterType } from "@/schemas/meters";
import { ReadingType } from "@/schemas/readings";
import { orderReadingsDesc } from "./dateOrderHelper";
export const combineMetersWithLatestReading = (
  meters: MeterType[],
  readings: ReadingType[]
) => {
  //   const monthOrder = {
  //     JAN: 1,
  //     FEB: 2,
  //     MAR: 3,
  //     APR: 4,
  //     MAY: 5,
  //     JUN: 6,
  //     JUL: 7,
  //     AUG: 8,
  //     SEP: 9,
  //     OCT: 10,
  //     NOV: 11,
  //     DEC: 12,
  //   };

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
