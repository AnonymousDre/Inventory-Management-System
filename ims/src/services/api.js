import axios from "axios";
import { supabase } from "../supabaseClient";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:4000/api",
});

api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
