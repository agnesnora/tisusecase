import { MeterType } from "@/schemas/meters";

//creating 2 arrays to store gas type and electricity type meters
export const separateMetersByType = (meters: MeterType[]) => {
  const gasMeters = meters.filter((meter) => meter.type === "gas");
  const electricityMeters = meters.filter(
    (meter) => meter.type === "electricity"
  );

  return { gasMeters, electricityMeters };
};
