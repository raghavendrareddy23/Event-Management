import axios from "axios";

const api = axios.create({
  baseURL: "https://event-management-backend-2oir.onrender.com/api",
});
export default api;
