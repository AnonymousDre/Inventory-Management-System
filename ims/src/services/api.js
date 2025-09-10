import axios from "axios";

export default axios.create({
  baseURL: "https://inventory-management-system-sc65.onrender.com", // your backend server
});
