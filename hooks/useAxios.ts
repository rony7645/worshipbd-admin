import axios from "axios";

// Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 5000,
  headers: {
    "Authorization": "Bearer YOUR_TOKEN"
  }
});

export default api;