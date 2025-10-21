import axios from "axios";

export default async function serverRequest(
  endpoint: string,
  method: "get" | "post" | "put" | "delete",
  data?: any,
) {
  const baseUrl = "http://localhost:5000/api/";

  try {
    if (method === "get") {
      const res = await axios.get(`${baseUrl}${endpoint}`);
      return res.data;
    } else if (method === "post") {
      const res = await axios.post(`${baseUrl}${endpoint}`, data);
      return res.data;
    } else if (method === "put") {
      const res = await axios.put(`${baseUrl}${endpoint}`, data);
      return res.data;
    } else if (method === "delete") {
      const res = await axios.delete(`${baseUrl}${endpoint}`);
      return res.data;
    } else {
      throw new Error("Unsupported HTTP method");
    }
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
