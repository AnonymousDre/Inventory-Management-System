import { useState } from "react";
import "./Register.css";

export default function Register({ onSwitchToLogin, onRegister }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation for demo purposes
    if (!form.username || !form.email || !form.password) {
      setMessage("All fields are required for enlistment");
      return;
    }
    
    if (form.password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      return;
    }
    
    // Simulate successful registration
    setMessage("Enlistment successful! Welcome to the force, " + form.username + "!");
    console.log("Registered user:", { username: form.username, email: form.email });
    
    // Simulate successful registration and redirect to dashboard
    setTimeout(() => {
      if (onRegister) onRegister();
    }, 1500);
    
    // Original API call (commented out for now)
    /*
    try {
      const res = await api.post("/register", form);
      setMessage(res.data.message);
      console.log("Registered user:", res.data.user);
      setTimeout(() => {
        if (onRegister) onRegister();
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
    }
    */
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
            
            <button type="submit" className="military-button">
              <span className="button-text">ENLIST NOW</span>
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