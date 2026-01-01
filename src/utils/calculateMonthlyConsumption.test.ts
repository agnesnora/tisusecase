import { describe, expect, test } from "vitest";
import { MeterType } from "../schemas/meters";
import { ReadingType, ReadingWithConsumption } from "../schemas/readings";
import {
  calculateMonthlyConsumption,
  groupByMonth,
} from "./calculateMonthlyConsumption";

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
    { id: "2", meterId: "m2", month: "JAN", year: 2024, value: 200 },
    { id: "3", meterId: "m1", month: "FEB", year: 2024, value: 150 },
    { id: "6", meterId: "m2", month: "MAR", year: 2024, value: 260 },
    { id: "1", meterId: "m1", month: "JAN", year: 2024, value: 100 },
    { id: "4", meterId: "m2", month: "FEB", year: 2024, value: 230 },
  ];

  test("should calculate monthly consumption for electricity and gas", () => {
    const result = calculateMonthlyConsumption(readings, meters);

    expect(result.electricity).toHaveLength(2);
    expect(result.gas).toHaveLength(3); // JAN, FEB, MAR
  });
});

describe("groupByMonth", () => {
  test("should group readings by month and sum totals correctly", () => {
    const mockReadings: Record<string, ReadingWithConsumption[]> = {
      m1: [
        {
          id: "1",
          meterId: "m1",
          month: "JAN",
          year: 2024,
          value: 100,
          consumption: 0,
          date: "2024-01",
        },
        {
          id: "2",
          meterId: "m1",
          month: "FEB",
          year: 2024,
          value: 150,
          consumption: 50,
          date: "2024-02",
        },
        {
          id: "3",
          meterId: "m1",
          month: "APR",
          year: 2024,
          value: 250,
          consumption: 100,
          date: "2024-04",
        },
      ],
      m2: [
        {
          id: "3",
          meterId: "m2",
          month: "JAN",
          year: 2024,
          value: 200,
          consumption: 0,
          date: "2024-01",
        },
        {
          id: "4",
          meterId: "m2",
          month: "FEB",
          year: 2024,
          value: 230,
          consumption: 30,
          date: "2024-02",
        },
      ],
    };

    const result = groupByMonth(mockReadings);
    console.log(result);

    expect(result).toHaveLength(3);

    // January data
    expect(result[0].date).toBe("2024-01");
    expect(result[0].total).toBe(0); // 0 + 0
    expect(result[0].m1).toBe(0);
    expect(result[0].m2).toBe(0);

    // February data
    expect(result[1].date).toBe("2024-02");
    expect(result[1].total).toBe(80); // 50 + 30
    expect(result[1].m1).toBe(50);
    //No data for March
    //April with only one meter
    expect(result[2].date).toBe("2024-04");
    expect(result[2].m1).toBe(100);
  });

  test("should handle single meter multiple months", () => {
    const mockReadings: Record<string, ReadingWithConsumption[]> = {
      m1: [
        {
          id: "1",
          meterId: "m1",
          month: "JAN",
          year: 2024,
          value: 100,
          consumption: 0,
          date: "2024-01",
        },
        {
          id: "2",
          meterId: "m1",
          month: "MAR",
          year: 2024,
          value: 180,
          consumption: 80,
          date: "2024-03",
        },
      ],
    };

    const result = groupByMonth(mockReadings);

    expect(result).toHaveLength(2);
    expect(result[0].date).toBe("2024-01");
    expect(result[0].m1).toBe(0);
    expect(result[1].date).toBe("2024-03");
    expect(result[1].m1).toBe(80);
  });
});
