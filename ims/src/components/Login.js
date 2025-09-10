import { useState } from "react";
import { supabase } from "../supabaseClient";
import "./Login.css";

export default function Login({ onSwitchToRegister, onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Login successful! Redirecting to command center...");
        console.log("Logged in user:", data.user);
        // Redirect to dashboard after successful login
        setTimeout(() => {
          if (onLogin) onLogin();
        }, 1500);
      }
    } catch (err) {
      setMessage("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
      });

      if (error) {
        setMessage(error.message);
      }
    } catch (err) {
      setMessage("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="military-login-container">
      <div className="camouflage-background"></div>
      <div className="login-content">
        <div className="logo-container">
          <h1 className="military-logo">Ammu-Nation</h1>
        </div>
        
        <div className="login-form-container">
          <div className="form-header">
            <h2 className="form-title">SECURE ACCESS</h2>
            <div className="military-divider"></div>
          </div>
          
          <form onSubmit={handleSubmit} className="military-form">
            <div className="input-group">
              <label className="input-label">IDENTIFICATION</label>
              <input 
                name="email" 
                type="email"
                placeholder="Enter your email" 
                value={form.email}
                onChange={handleChange}
                className="military-input"
                required
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">CLASSIFIED CODE</label>
              <input 
                type="password" 
                name="password" 
                placeholder="Enter your password" 
                value={form.password}
                onChange={handleChange}
                className="military-input"
                required
              />
            </div>
            
            <button type="submit" className="military-button" disabled={loading}>
              <span className="button-text">
                {loading ? "AUTHORIZING..." : "AUTHORIZE ACCESS"}
              </span>
              <div className="button-accent"></div>
            </button>
          </form>
          
          <div className="divider">
            <span>OR</span>
          </div>
          
          <button 
            className="github-button"
            onClick={handleGitHubLogin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in with GitHub"}
          </button>
          
          {message && (
            <div className={`message ${message.includes('failed') || message.includes('error') || message.includes('Invalid') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
          
          <div className="switch-form">
            <p className="switch-text">Not enlisted yet?</p>
            <button 
              type="button" 
              className="switch-button"
              onClick={onSwitchToRegister}
            >
              ENLIST NOW
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