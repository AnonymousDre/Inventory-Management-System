import { useState } from "react";
import api from "../services/api";
import "../styles/login.css";

export default function Login({ onShowRegister }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", form);
      setMessage(res.data.message);
      console.log("Logged in user:", res.data.user);
    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <h2>MRA Defense Inventory</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <button type="submit">Login</button>
      </form>
            <a
        href="#"
        className="link-button"
        onClick={(e) => {
          e.preventDefault();
          onShowRegister();
        }}
      >
        Create account
      </a>
      {message && <p className="message">{message}</p>}
    </div>
  );
}