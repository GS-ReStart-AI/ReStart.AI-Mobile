import axios from "axios";

export const api = axios.create({
  baseURL: "https://restartai-api-001.azurewebsites.net",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "dev-swagger-key-123",
  },
});
