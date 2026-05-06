import axios from "axios";
import fallbackData from "../../db 1.json";
const apiClient = axios.create({
  // baseURL: "http://localhost:3000", // json mock server
  baseURL: "https://meter-mock-json.onrender.com", // json mock server
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config.url;
    if (url === "/meters") return { data: fallbackData.meters };
    if (url === "/readings") return { data: fallbackData.readings };
    if (url.startsWith("/meters/")) {
      const id = url.split("/")[2];
      const meter = fallbackData.meters.find((m) => m.id === id);
      return { data: meter };
    }
    throw error;
  },
);

export default apiClient;
