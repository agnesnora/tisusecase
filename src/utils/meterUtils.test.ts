import { calculateMeterStats } from "./meterUtils";
import { ReadingType } from "./../schemas/readings";
import { describe, expect, test } from "vitest";
import { calculateConsumption } from "./meterUtils";
import { separateMetersByType } from "./meterUtils";
import { MeterType } from "../schemas/meters";

//Testing calculateConsumption

describe("calculateConsumption", () => {
  test("should return 0 when there is no previous reading", () => {
    const reading: ReadingType = {
      id: "3",
      meterId: "0001",
      month: "AUG",
      year: 2024,
      value: 100,
    };
    const result = calculateConsumption(reading, undefined);
    expect(result).toEqual(0);
  });

  test("should return 0 when the previous reading equals to the current reading", () => {
    const currentReading: ReadingType = {
      id: "5",
      meterId: "0002",
      month: "SEP",
      year: 2024,
      value: 200,
    };
    const previousReading: ReadingType = {
      id: "4",
      meterId: "0002",
      month: "AUG",
      year: 2024,
      value: 200,
    };

    const result = calculateConsumption(currentReading, previousReading);
    expect(result).toEqual(0);
  });

  test("should calculate consumption correctly when there is previous reading", () => {
    const currentReading: ReadingType = {
      id: "5",
      meterId: "0002",
      month: "SEP",
      year: 2024,
      value: 200,
    };
    const previousReading: ReadingType = {
      id: "4",
      meterId: "0002",
      month: "AUG",
      year: 2024,
      value: 100,
    };

    const result = calculateConsumption(currentReading, previousReading);
    expect(result).toEqual(100);
  });

  test("should handle floating points", () => {
    const currentReading: ReadingType = {
      id: "5",
      meterId: "0002",
      month: "SEP",
      year: 2024,
      value: 1.1,
    };
    const previousReading: ReadingType = {
      id: "4",
      meterId: "0002",
      month: "AUG",
      year: 2024,
      value: 1,
    };
    const result = calculateConsumption(currentReading, previousReading);
    expect(result).toBeCloseTo(0.1);
  });
  test("should throw an error if value is negative", () => {
    const currentReading: ReadingType = {
      id: "5",
      meterId: "0002",
      month: "SEP",
      year: 2024,
      value: 200,
    };
    const previousReading: ReadingType = {
      id: "4",
      meterId: "0002",
      month: "AUG",
      year: 2024,
      value: -100,
    };

    expect(() => calculateConsumption(currentReading, previousReading)).toThrow(
      "Value cannot be negative"
    );
  });
});
//Testing sepatareMetersByType
describe("separateMetersByType", () => {
  test("should correctly separate meters by type", () => {
    const meters: MeterType[] = [
      {
        id: "0001",
        label: "Urithiru Tower Pinnacle - Electricity",
        location: {
          lat: 47.5316,
          lon: 21.6273,
        },
        type: "electricity",
        unit: "kWh",
      },
      {
        id: "0002",
        label: "Shattered Plains Chasmfiend Nest - Gas",
        location: {
          lat: 47.5331,
          lon: 21.6114,
        },
        type: "gas",
        unit: "m3",
      },
      {
        id: "0003",
        label: "Kholinar Palace Oathgate - Electricity",
        location: {
          lat: 47.5311,
          lon: 21.6244,
        },
        type: "electricity",
        unit: "kWh",
      },
    ];
    const result = separateMetersByType(meters);
    expect(result.gasMeters).toHaveLength(1);
    expect(result.electricityMeters).toHaveLength(2);
    expect(result.electricityMeters[1].type).toBe("electricity");
  });
  test("should return empty arrays if input is empty", () => {
    const result = separateMetersByType([]);

    expect(result.gasMeters).toHaveLength(0);
    expect(result.electricityMeters).toHaveLength(0);
    expect(result.gasMeters).toEqual([]);
    expect(result.electricityMeters).toEqual([]);
  });
});
//Testing calculateMeterSTats
describe("calculateMeterStats", () => {
  test("should calculate meter stats correctly", () => {
    const readings: ReadingType[] = [
      {
        id: "6",
        meterId: "0002",
        month: "JUL",
        year: 2024,
        value: 110,
      },
      {
        id: "8",
        meterId: "0002",
        month: "SEP",
        year: 2024,
        value: 160,
      },
      {
        id: "7",
        meterId: "0002",
        month: "AUG",
        year: 2024,
        value: 130,
      },
      {
        id: "5",
        meterId: "0002",
        month: "JUN",
        year: 2024,
        value: 100,
      },
    ];

    const result = calculateMeterStats(readings);

    expect(result.average).toEqual(20);
    expect(result.highest).toEqual(30);
    expect(result.lowest).toEqual(10);
    expect(result.highestMonth?.month).toBe("SEP");
    expect(result.lowestMonth?.month).toBe("JUL");
  });

  test("Returns default values when the array is empty", () => {
    const readings: ReadingType[] = [];
    const result = calculateMeterStats(readings);

    expect(result).toEqual({
      average: 0,
      highest: 0,
      lowest: 0,
      highestMonth: null,
      lowestMonth: null,
    });
  });
  test("Returns default values when the array contains only one reading", () => {
    const readings: ReadingType[] = [
      {
        id: "7",
        meterId: "0002",
        month: "AUG",
        year: 2024,
        value: 130,
      },
    ];
    const result = calculateMeterStats(readings);

    expect(result).toEqual({
      average: 0,
      highest: 0,
      lowest: 0,
      highestMonth: null,
      lowestMonth: null,
    });
  });

  test("Returns correct values when the array have only two readings", () => {
    const readings: ReadingType[] = [
      {
        id: "7",
        meterId: "0002",
        month: "AUG",
        year: 2024,
        value: 130,
      },
      {
        id: "5",
        meterId: "0002",
        month: "JUN",
        year: 2024,
        value: 100,
      },
    ];
    const result = calculateMeterStats(readings);
    expect(result.average).toEqual(30);
    expect(result.highest).toEqual(30);
    expect(result.lowest).toEqual(30);
    expect(result.highestMonth?.month).toBe("AUG");
    expect(result.lowestMonth?.month).toBe("AUG");
  });
});
