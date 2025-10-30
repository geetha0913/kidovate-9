import axios from "axios";

const API = axios.create({
  baseURL: "https://kidovate-9-1.onrender.com/api",  // your Render backend URL
});

export default API;
