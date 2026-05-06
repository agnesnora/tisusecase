import { readingsStore } from "../store";
import { ReadingType, AddReadingType, EditType } from "@/schemas/readings";

export const fetchReadingsList = async (): Promise<ReadingType[]> => [
  ...readingsStore,
];

export const fetchReadingsByMeterId = async (
  id: string,
): Promise<ReadingType[]> => readingsStore.filter((r) => r.meterId === id);

export const deleteReadingById = async (id: string): Promise<void> => {
  const idx = readingsStore.findIndex((r) => r.id === id);
  if (idx !== -1) readingsStore.splice(idx, 1);
};

export const addReading = async ({
  meterId,
  data,
}: {
  meterId: string;
  data: AddReadingType;
}): Promise<ReadingType> => {
  const newReading: ReadingType = {
    id: crypto.randomUUID(),
    meterId,
    month: data.month,
    year: data.year,
    value: data.value,
  };
  readingsStore.push(newReading);
  return newReading;
};

export const editReading = async (
  id: string,
  data: EditType,
): Promise<ReadingType> => {
  const idx = readingsStore.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error(`Reading ${id} not found`);
  readingsStore[idx] = { ...readingsStore[idx], value: data.value };
  return readingsStore[idx];
};
