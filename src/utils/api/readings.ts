import apiClient from "../apiClient";
import { ReadingType, AddReadingType, EditType } from "@/schemas/readings";

export const fetchReadingsList = async (): Promise<ReadingType[]> => {
  const response = await apiClient.get("/readings");

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

export const deleteReadingById = async (id: string): Promise<void> => {
  await apiClient.delete(`/readings/${id}`);
};

export const addReading = async (
  data: AddReadingType
): Promise<ReadingType> => {
  const response = await apiClient.post("/readings", data);
  return response.data;
};

export const editReading = async (
  id: string,
  data: EditType
): Promise<ReadingType> => {
  const response = await apiClient.put(`/readings/${id}`, data);
  return response.data;
};
