import { MeterType } from "@/schemas/meters";
import { ReadingType } from "@/schemas/readings";
import { orderReadingsAsc } from "./dateOrderHelper";
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
  return previousReading ? reading.value - previousReading.value : 0;
};

export const calculateMeterStats = (readings: ReadingType[]) => {
  const sortedReadings = readings.sort(orderReadingsAsc);
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
    avarage:
      consumptionValues.reduce((acc, curr) => acc + curr, 0) /
      consumptionValues.length,
    highest,
    lowest,
    highestMonth: validConsumptions.find((r) => r.consumption === highest), // 3. használat
    lowestMonth: validConsumptions.find((r) => r.consumption === lowest), // 3. használat
  };
};
