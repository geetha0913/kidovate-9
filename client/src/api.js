// client/src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://kidovate-9-1.onrender.com/api", // ✅ Render backend URL
});

export default API;
