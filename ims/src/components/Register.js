import { useState } from "react";
import { supabase } from "../supabaseClient";
import "./Register.css";

export default function Register({ onSwitchToLogin, onRegister }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    // Basic validation
    if (!form.username || !form.email || !form.password) {
      setMessage("All fields are required for enlistment");
      setLoading(false);
      return;
    }
    
    if (form.password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            username: form.username,
          }
        }
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Enlistment successful! Please check your email to verify your account.");
        console.log("Registered user:", data.user);
        
        // Redirect to dashboard after successful registration
        setTimeout(() => {
          if (onRegister) onRegister();
        }, 2000);
      }
    } catch (err) {
      setMessage("An unexpected error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="military-register-container">
      <div className="camouflage-background"></div>
      <div className="register-content">
        <div className="logo-container">
          <h1 className="military-logo">THIS IS AMERICA</h1>
        </div>
        
        <div className="register-form-container">
          <div className="form-header">
            <h2 className="form-title">ENLISTMENT PROTOCOL</h2>
            <div className="military-divider"></div>
          </div>
          
          <form onSubmit={handleSubmit} className="military-form">
            <div className="input-group">
              <label className="input-label">CALL SIGN</label>
              <input 
                name="username" 
                placeholder="Enter your username" 
                onChange={handleChange}
                className="military-input"
                required
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">IDENTIFICATION</label>
              <input 
                name="email" 
                placeholder="Enter your email" 
                onChange={handleChange}
                className="military-input"
                type="email"
                required
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">CLASSIFIED CODE</label>
              <input 
                type="password" 
                name="password" 
                placeholder="Enter your password" 
                onChange={handleChange}
                className="military-input"
                required
              />
            </div>
            
            <button type="submit" className="military-button" disabled={loading}>
              <span className="button-text">
                {loading ? "ENLISTING..." : "ENLIST NOW"}
              </span>
              <div className="button-accent"></div>
            </button>
          </form>
          
          {message && (
            <div className={`message ${message.includes('failed') || message.includes('error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
          
          <div className="switch-form">
            <p className="switch-text">Already enlisted?</p>
            <button 
              type="button" 
              className="switch-button"
              onClick={onSwitchToLogin}
            >
              REPORT FOR DUTY
            </button>
          </div>
        </div>
        
        <div className="military-footer">
          <p>CLASSIFIED SYSTEM - AUTHORIZED PERSONNEL ONLY</p>
        </div>
      </div>
    </div>
  );
}