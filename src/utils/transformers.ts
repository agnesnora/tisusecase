import { MeterType } from "../schemas/meters";
import { ReadingType } from "../schemas/readings";

export type MeterRow = {
  id: string;
  label: string;
  type: "electricity" | "gas";
  unit: "kWh" | "m3";
  location_lat: number;
  location_lon: number;
  created_at: string;
};

export type ReadingRow = {
  id: string;
  meter_id: string;
  month:
    | "JAN"
    | "FEB"
    | "MAR"
    | "APR"
    | "MAY"
    | "JUN"
    | "JUL"
    | "AUG"
    | "SEP"
    | "OCT"
    | "NOV"
    | "DEC";
  year: number;
  value: number;
  created_at: string;
};

export const toMeterType = (row: MeterRow): MeterType => ({
  id: row.id,
  label: row.label,
  type: row.type,
  unit: row.unit,
  location: {
    lat: row.location_lat,
    lon: row.location_lon,
  },
});

export const toReadingType = (row: ReadingRow): ReadingType => ({
  id: row.id,
  meterId: row.meter_id,
  month: row.month,
  year: row.year,
  value: row.value,
});
