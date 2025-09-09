import { useState } from "react";
import api from "../services/api";
import "../styles/register.css";

export default function Register({ onShowLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/register", form);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <h2>Register</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <input name="username" placeholder="Username" onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} />
          <button type="submit">Register</button>
        </form>
        <a
          href="#"
          className="link-button"
          onClick={(e) => {
            e.preventDefault();
            onShowLogin();
          }}
        >
          Back to Login
        </a>
        {message && <p className="message">{message}</p>}
      </div>
      <div className="register-image"></div>
    </div>
  );
}