import { ReadingType } from "@/schemas/readings";
import { orderReadingsAsc } from "./dateOrderHelper";

export interface MonotonicValidationParams {
  currentReading: ReadingType;
  newValue: number;
  allReadings: ReadingType[];
}

export const validateMonotonicValue = ({
  currentReading,
  newValue,
  allReadings,
}: MonotonicValidationParams): string | null => {
  const sortedReadings = [...allReadings].sort(orderReadingsAsc);

  const currentIndex = sortedReadings.findIndex(
    (reading) => reading.id === currentReading.id
  );
  const previousReading = sortedReadings[currentIndex - 1];
  const nextReading = sortedReadings[currentIndex + 1];

  if (previousReading && newValue < previousReading.value) {
    return `Value must be greater than or equal to the previous reading ${previousReading.value} (${previousReading.month} ${previousReading.year})`;
  }
  if (nextReading && newValue > nextReading.value) {
    return `Value must be less than or equal to the next reading ${nextReading.value} (${nextReading.month} ${nextReading.year})`;
  }
  return null;
};
