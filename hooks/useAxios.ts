import axios from "axios";

// Axios instance
const api = axios.create({
  baseURL: "http://localhost:5001",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_TOKEN"
  }
});

export default api;