import { calculateMonthlyConsumption } from "./calculateMonthlyConsumption";
import { describe, test, expect } from "vitest";
import { ReadingType, ReadingWithConsumption } from "../schemas/readings";
import { MeterType } from "../schemas/meters";

// export const calculateMonthlyConsumption = (
//   readings: ReadingType[],
//   meters: MeterType[]
// ) => {
//   const { electricityMeters, gasMeters } = separateMetersByType(meters);

//   const electricityConsumption = calculateForType(readings, electricityMeters);
//   const gasConsumption = calculateForType(readings, gasMeters);

//   return {
//     electricity: groupByMonth(electricityConsumption),
//     gas: groupByMonth(gasConsumption),
//   };
// };

describe("calculateMonthlyConsumption", () => {
  const meters: MeterType[] = [
    {
      id: "m1",
      label: "Tower - Electricity",
      location: { lat: 47.5, lon: 21.6 },
      type: "electricity",
      unit: "kWh",
    },
    {
      id: "m2",
      label: "Chasm - Gas",
      location: { lat: 47.53, lon: 21.61 },
      type: "gas",
      unit: "m3",
    },
  ];
  const readings: ReadingType[] = [
    { id: "5", meterId: "m1", month: "MAR", year: 2024, value: 180 },
    { id: "2", meterId: "m2", month: "JAN", year: 2024, value: 200 },
    { id: "3", meterId: "m1", month: "FEB", year: 2024, value: 150 },
    { id: "6", meterId: "m2", month: "MAR", year: 2024, value: 260 },
    { id: "1", meterId: "m1", month: "JAN", year: 2024, value: 100 },
    { id: "4", meterId: "m2", month: "FEB", year: 2024, value: 230 },
  ];

  test("should calculate monthly consumption for electricity and gas", () => {
    const result = calculateMonthlyConsumption(readings, meters);

    expect(result.electricity).toHaveLength(3);
    expect(result.gas).toHaveLength(3); // JAN, FEB, MAR
    // // Optional: check totals
    expect(result.electricity[0].total).toEqual(0); // first reading = 0
    expect(result.electricity[1].total).toEqual(50); // 150-100
    expect(result.electricity[2].total).toEqual(30); // 180-150
  });
});
