import db from "../../../db 1.json";
import { MeterType } from "@/schemas/meters";

export const fetchMetersList = async (): Promise<MeterType[]> =>
  db.meters as MeterType[];

export const fetchMeterById = async (id: string): Promise<MeterType> => {
  const meter = db.meters.find((m) => m.id === id);
  if (!meter) throw new Error(`Meter with id ${id} not found`);
  return meter as MeterType;
};
