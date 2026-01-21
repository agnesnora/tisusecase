import axios from "axios";

const apiClient = axios.create({
  // baseURL: "http://localhost:3001", // json mock server
  baseURL: "https://meter-mock-json.onrender.com", // json mock server
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
