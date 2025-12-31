import { MeterType } from "../schemas/meters";
import { ReadingType } from "../schemas/readings";
import {
  calculateConsumption,
  separateMetersByType,
} from "../utils/meterUtils";

import { monthOrder, orderReadingsAsc } from "../utils/dateOrderHelper";
import { ReadingWithConsumption } from "../schemas/readings";

export const calculateForType = (
  readings: ReadingType[],
  meters: MeterType[]
) => {
  const meterIds = meters.map((meter) => meter.id);
  const filteredReadings = readings
    .filter(
      (reading) =>
        reading.meterId != null &&
        reading.month != null &&
        reading.year != null &&
        reading.value !== undefined
    )
    .filter((reading) => meterIds.includes(reading.meterId));

  const readingsByMeterWithConsumption = filteredReadings.reduce<
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
  return readingsByMeterWithConsumption;
};

type MonthlyDataPoint = {
  date: string;
  total: number;
  [meterId: string]: string | number;
};
export const groupByMonth = (
  readingsByMeterWithConsumption: Record<string, ReadingWithConsumption[]>
): MonthlyDataPoint[] => {
  const allReadings = Object.values(readingsByMeterWithConsumption).flat();

  const monthlyData = allReadings.reduce<Record<string, MonthlyDataPoint>>(
    (acc, reading) => {
      const date = reading.date;

      if (!acc[date]) {
        acc[date] = {
          date,
          total: 0,
        };
      }

      // Érték hozzáadása a konkrét mérőhöz
      acc[date][reading.meterId] = reading.consumption;

      // Számszerű összesítés
      acc[date].total += reading.consumption;

      return acc;
    },
    {}
  );

  return Object.values(monthlyData).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
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
