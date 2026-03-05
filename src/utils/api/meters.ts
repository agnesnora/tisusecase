import { supabase } from "./supaBaseClient";
import { MeterType } from "@/schemas/meters";
type MeterRow = {
  id: string;
  label: string;
  type: "electricity" | "gas";
  unit: "kWh" | "m3";
  location_lat: number;
  location_lon: number;
  created_at: string;
};

const toMeterType = (row: MeterRow): MeterType => ({
  id: row.id,
  label: row.label,
  type: row.type,
  unit: row.unit,
  location: {
    lat: row.location_lat,
    lon: row.location_lon,
  },
});

export const fetchMetersList = async (): Promise<MeterType[]> => {
  const { data, error } = await supabase.from("meters").select("*");

  if (error) {
    console.error("Error fetching meters:", error);
    throw error;
  }

  // Itt már Type Assertion-t (as) használunk, hogy a TS tudja, a data MeterRow[]
  return (data as MeterRow[]).map(toMeterType);
};

export const fetchMeterById = async (id: string): Promise<MeterType> => {
  const { data, error } = await supabase
    .from("meters")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching meter ${id}:`, error);
    throw new Error(`Meter with id ${id} not found`);
  }

  return toMeterType(data as MeterRow);
};
