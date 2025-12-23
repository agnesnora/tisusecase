import { MeterType } from "@/schemas/meters";
import { ReadingType } from "@/schemas/readings";
import { calculateConsumption, separateMetersByType } from "@/utils/meterUtils";

import { monthOrder } from "@/utils/dateOrderHelper";
import { ReadingWithConsumption } from "@/schemas/readings";

const calculateForType = (readings: ReadingType[], meters: MeterType[]) => {
  const meterIds = meters.map((m) => m.id);
  const filteredReadings = readings.filter((r) => meterIds.includes(r.meterId));
  const reaingsByMeterWithConsumption = filteredReadings.reduce<
    Record<string, ReadingWithConsumption[]>
  >((acc, reading) => {
    //Get existing readings for this meter (or empty array if none)
    const meterReadings = acc[reading.meterId] || [];

    //Find the previous reading (last element in sorted array)
    const previousReading = meterReadings[meterReadings.length - 1];

    //Calculate consumption if previous reading exists
    const consumption = calculateConsumption(reading, previousReading);
    //Cretate a new object with consumption added and date formatted
    const readingWithConsumption = {
      ...reading,
      consumption,
      date: `${reading.year}-${monthOrder[reading.month]
        .toString()
        .padStart(2, "0")}`,
    };

    //Update accumulator with expanded reading

    acc[reading.meterId] = [...meterReadings, readingWithConsumption];
    return acc;
  }, {});
  return reaingsByMeterWithConsumption;
};
const groupByMonth = (
  readingsByMeterWithConsumption: Record<string, ReadingWithConsumption[]>
) => {
  const allReadings = Object.values(readingsByMeterWithConsumption).flat();
  const monthlyData = allReadings.reduce((acc, reading) => {
    const date = reading.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push({
      meterId: reading.meterId,
      consumption: reading.consumption,
    });
    return acc;
  }, {} as Record<string, { meterId: string; consumption: number }[]>);

  return Object.entries(monthlyData).map(([date, meters]) => ({
    date,
    meters,
    total: meters.reduce((sum, meter) => sum + meter.consumption, 0), // ← Total!
  }));
};

export const calculateMonthlyConsumption = (
  readings: ReadingType[],
  meters: MeterType[]
) => {
  const { electricityMeters, gasMeters } = separateMetersByType(meters);

  const electricityConsumption = calculateForType(readings, electricityMeters);
  const gasConsumption = calculateForType(readings, gasMeters);

  return {
    electricity: groupByMonth(electricityConsumption),
    gas: groupByMonth(gasConsumption),
  };
};
