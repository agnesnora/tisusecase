import apiClient from "../apiClient";
import { MeterType } from "@/schemas/meters";

const fetchMetersList = async (): Promise<MeterType[]> => {
  const response = await apiClient.get("/meters");
  console.log(response.data);
  return response.data;
};

export default fetchMetersList;
