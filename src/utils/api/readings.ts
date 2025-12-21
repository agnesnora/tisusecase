import apiClient from "../apiClient";
import { ReadingType } from "@/schemas/readings";

const fetchReadingsList = async (): Promise<ReadingType[]> => {
  const response = await apiClient.get("/readings");
  console.log(response.data);
  return response.data;
};

export default fetchReadingsList;
