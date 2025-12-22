import apiClient from "../apiClient";
import { ReadingType } from "@/schemas/readings";

export const fetchReadingsList = async (): Promise<ReadingType[]> => {
  const response = await apiClient.get("/readings");
  console.log(response.data);
  return response.data;
};

export const fetchReadingsByMeterId = async (
  id: string
): Promise<ReadingType[]> => {
  const response = await apiClient.get("/readings");
  const filteredReadings = response.data.filter(
    (reading: ReadingType) => reading.meterId === id
  );
  return filteredReadings;
};
