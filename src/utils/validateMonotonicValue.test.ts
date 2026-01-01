import { validateMonotonicValue } from "./validateMonotonicValue";
import { describe, test, expect } from "vitest";
import { ReadingType } from "@/schemas/readings";

describe("validateMonotonicValues", () => {
  test("should return null when new value is between previous and next readings", () => {
    const currentReading: ReadingType = {
      id: "2",
      meterId: "0001",
      value: 100,
      month: "FEB",
      year: 2023,
    };
    const newValue = 180;
    const allReadings: ReadingType[] = [
      { id: "1", value: 100, meterId: "0001", month: "JAN", year: 2023 },
      { id: "2", value: 200, meterId: "0001", month: "FEB", year: 2023 },
      { id: "3", value: 300, meterId: "0001", month: "MAR", year: 2023 },
    ];
    const result = validateMonotonicValue({
      currentReading,
      newValue,
      allReadings,
    });
    expect(result).toBe(null);
  });
  test("should return null when new value is greater then or equal to previous reading", () => {
    const currentReading: ReadingType = {
      id: "2",
      meterId: "0001",
      value: 120,
      month: "FEB",
      year: 2023,
    };
    const newValue = 180;
    const allReadings: ReadingType[] = [
      { id: "1", value: 100, meterId: "0001", month: "JAN", year: 2023 },
      { id: "2", value: 200, meterId: "0001", month: "FEB", year: 2023 },
    ];
    const result = validateMonotonicValue({
      currentReading,
      newValue,
      allReadings,
    });
    expect(result).toBe(null);
  });
  test("should return null when new value is smaller then or equal to previous reading", () => {
    const currentReading: ReadingType = {
      id: "2",
      meterId: "0001",
      value: 120,
      month: "JAN",
      year: 2023,
    };
    const newValue = 180;
    const allReadings: ReadingType[] = [
      { id: "1", value: 100, meterId: "0001", month: "JAN", year: 2023 },
      { id: "2", value: 200, meterId: "0001", month: "FEB", year: 2023 },
    ];
    const result = validateMonotonicValue({
      currentReading,
      newValue,
      allReadings,
    });
    expect(result).toBe(null);
  });

  test("should return error if value is greater than next readings value", () => {
    const currentReading: ReadingType = {
      id: "1",
      meterId: "0001",
      value: 100,
      month: "JAN",
      year: 2023,
    };
    const newValue = 201;
    const allReadings: ReadingType[] = [
      { id: "1", value: 100, meterId: "0001", month: "JAN", year: 2023 },
      { id: "2", value: 200, meterId: "0001", month: "FEB", year: 2023 },
    ];
    const result = validateMonotonicValue({
      currentReading,
      newValue,
      allReadings,
    });
    expect(result).toBe(
      "Value must be less than or equal to the next reading 200 (FEB 2023)"
    );
  });
});
test("should return error if value is less than previous readings value", () => {
  const currentReading: ReadingType = {
    id: "2",
    meterId: "0001",
    value: 100,
    month: "FEB",
    year: 2023,
  };
  const newValue = 99;
  const allReadings: ReadingType[] = [
    { id: "1", value: 100, meterId: "0001", month: "JAN", year: 2023 },
    { id: "2", value: 200, meterId: "0001", month: "FEB", year: 2023 },
  ];
  const result = validateMonotonicValue({
    currentReading,
    newValue,
    allReadings,
  });
  expect(result).toBe(
    "Value must be greater than or equal to the previous reading 100 (JAN 2023)"
  );
});
