import { MeterType } from "@/schemas/meters";
import { ReadingType } from "@/schemas/readings";
import { orderReadingsAsc, monthOrder } from "./dateOrderHelper";
//creating 2 arrays to store gas type and electricity type meters
export const separateMetersByType = (meters: MeterType[]) => {
  const gasMeters = meters.filter((meter) => meter.type === "gas");
  const electricityMeters = meters.filter(
    (meter) => meter.type === "electricity"
  );

  return { gasMeters, electricityMeters };
};
export const calculateConsumption = (
  reading: ReadingType,
  previousReading?: ReadingType
) => {
  if (reading.value < 0 || (previousReading && previousReading.value < 0)) {
    throw new Error("Value cannot be negative");
  }
  return previousReading ? reading.value - previousReading.value : 0;
};

export const calculateMeterStats = (readings: ReadingType[]) => {
  const validReadings = readings.filter(
    (r) =>
      r.meterId != null &&
      r.month != null &&
      r.year != null &&
      r.value !== undefined
  );

  const sortedReadings = [...validReadings].sort(orderReadingsAsc);

  const firstReadingYear = sortedReadings[0]?.year;
  const firstReadingMonth = monthOrder[sortedReadings[0]?.month];
  const latestReadingYear = sortedReadings[sortedReadings.length - 1]?.year;
  const latestReadingMonth =
    monthOrder[sortedReadings[sortedReadings.length - 1]?.month];

  const allNumOfMonths =
    (latestReadingYear - firstReadingYear) * 12 +
    (latestReadingMonth - firstReadingMonth) +
    1;
  const readingsWithConsumption = sortedReadings.map((reading, index) => {
    const previousReading = index > 0 ? sortedReadings[index - 1] : undefined;
    const consumption = calculateConsumption(reading, previousReading);
    return { ...reading, consumption };
  });

  const validConsumptions = readingsWithConsumption.filter(
    (reading) => reading.consumption > 0
  );
  if (validConsumptions.length === 0) {
    return {
      average: 0,
      highest: 0,
      lowest: 0,
      highestMonth: null,
      lowestMonth: null,
    };
  }
  const consumptionValues = validConsumptions.map(
    (reading) => reading.consumption
  );
  const highest = Math.max(...consumptionValues);
  const lowest = Math.min(...consumptionValues);

  return {
    average:
      allNumOfMonths > 0
        ? consumptionValues.reduce((acc, curr) => acc + curr, 0) /
          allNumOfMonths
        : 0,
    highest,
    lowest,
    highestMonth: validConsumptions.findLast((r) => r.consumption === highest),
    lowestMonth: validConsumptions.findLast((r) => r.consumption === lowest),
  };
};
