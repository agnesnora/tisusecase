import db from "../../../db 1.json";
import { ReadingType, AddReadingType, EditType } from "@/schemas/readings";

export const fetchReadingsList = async (): Promise<ReadingType[]> =>
  db.readings as ReadingType[];

export const fetchReadingsByMeterId = async (
  id: string,
): Promise<ReadingType[]> =>
  (db.readings as ReadingType[]).filter((r) => r.meterId === id);

export const deleteReadingById = async (_id: string): Promise<void> => {
  // mock – React Query invalidation will trigger a refetch
};

export const addReading = async ({
  meterId,
  data,
}: {
  meterId: string;
  data: AddReadingType;
}): Promise<ReadingType> => ({
  id: crypto.randomUUID(),
  meterId,
  month: data.month,
  year: data.year,
  value: data.value,
});

export const editReading = async (
  id: string,
  data: EditType,
): Promise<ReadingType> => {
  const reading = (db.readings as ReadingType[]).find((r) => r.id === id);
  if (!reading) throw new Error(`Reading with id ${id} not found`);
  return { ...reading, value: data.value };
};
