import { supabase } from "./supaBaseClient";
import {
  ReadingType,
  AddReadingType,
  EditType,
  months,
} from "@/schemas/readings";

// 1. Létrehozunk egy szigorú típust a hónapoknak a Zod schema alapján
// Ez így fog kinézni: "JAN" | "FEB" | "MAR" | ...
type MonthName = (typeof months)[number];

// 2. A DB típusában is ezt a szigorú típust használjuk
type ReadingRow = {
  id: string;
  meter_id: string;
  month: MonthName; // <-- Itt a javítás: már nem string, hanem a konkrét enum
  year: number;
  value: number;
  created_at: string;
};

// 3. A transzformáló függvényben már nincs szükség 'as any'-re
const toReadingType = (row: ReadingRow): ReadingType => ({
  id: row.id,
  meterId: row.meter_id,
  month: row.month, // TypeScript most már tudja, hogy ez biztonságos
  year: row.year,
  value: row.value,
});

const toReadingRow = (data: AddReadingType, meterId: string) => ({
  meter_id: meterId,
  month: data.month,
  year: data.year,
  value: data.value,
});

export const fetchReadingsList = async (): Promise<ReadingType[]> => {
  const { data, error } = await supabase.from("readings").select("*");

  if (error) throw error;
  // Type assertion az egész tömbre, a map-en belül már következik a típus
  return (data as ReadingRow[]).map(toReadingType);
};

export const fetchReadingsByMeterId = async (
  id: string,
): Promise<ReadingType[]> => {
  const { data, error } = await supabase
    .from("readings")
    .select("*")
    .eq("meter_id", id);

  if (error) throw error;
  return (data as ReadingRow[]).map(toReadingType);
};

export const deleteReadingById = async (id: string): Promise<void> => {
  const { error } = await supabase.from("readings").delete().eq("id", id);
  if (error) throw error;
};

export const addReading = async ({
  meterId,
  data,
}: {
  meterId: string;
  data: AddReadingType;
}): Promise<ReadingType> => {
  const dbData = toReadingRow(data, meterId);
  const id = crypto.randomUUID();

  const { data: newReading, error } = await supabase
    .from("readings")
    .insert({ ...dbData, id })
    .select()
    .single();

  if (error) throw error;
  return toReadingType(newReading as ReadingRow);
};

export const editReading = async (
  id: string,
  data: EditType,
): Promise<ReadingType> => {
  const { data: updatedReading, error } = await supabase
    .from("readings")
    .update({ value: data.value })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return toReadingType(updatedReading as ReadingRow);
};
