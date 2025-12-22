import apiClient from "../apiClient";
import { MeterType } from "@/schemas/meters";

export const fetchMetersList = async (): Promise<MeterType[]> => {
  const response = await apiClient.get("/meters");
  console.log(response.data);
  return response.data;
};

export const fetchMeterById = async (id: string): Promise<MeterType> => {
  const response = await apiClient.get(`/meters/${id}`);
  const meter = response.data;

  if (!meter) {
    throw new Error(`Meter with id ${id} not found`);
  }

  return meter;
};
