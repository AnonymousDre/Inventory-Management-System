import { useState } from "react";
import { supabase } from "../supabaseClient";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
import "./Login.css";

export default function Login({ onSwitchToRegister, onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Login successful!");
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Static test account for demo purposes
    const testAccount = {
      email: "commander@america.com",
      password: "password123"
    };
    
    // Check if credentials match test account
    if (form.email === testAccount.email && form.password === testAccount.password) {
      setMessage("Login successful! Redirecting to command center...");
      console.log("Logged in user: Commander");
      // Simulate successful login and redirect to dashboard
      setTimeout(() => {
        if (onLogin) onLogin();
      }, 1500);
    } else {
      setMessage("Invalid credentials. Use: commander@america.com / password123");
    }
    
    // Original API call (commented out for now)
    /*
    try {
      const res = await api.post("/login", form);
      setMessage(res.data.message);
      console.log("Logged in user:", res.data.user);
      setTimeout(() => {
        if (onLogin) onLogin();
      }, 1000);
    } catch (err) {
      setMessage("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
    */
  };

  return (
    <div className="login-container">
      <h2>MRA Defense Inventory</h2>
      <form className="login-form" onSubmit={handleEmailLogin}>
        <input 
          type="email"
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
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
      
      {message && <p className="message">{message}</p>}
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
                placeholder="Enter your email" 
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
                onChange={handleChange}
                className="military-input"
                required
              />
            </div>
            
            <button type="submit" className="military-button">
              <span className="button-text">AUTHORIZE ACCESS</span>
              <div className="button-accent"></div>
            </button>
          </form>
          
          {message && (
            <div className={`message ${message.includes('failed') || message.includes('error') ? 'error' : 'success'}`}>
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
            <div className="test-credentials">
              <p><strong>TEST CREDENTIALS:</strong></p>
              <p>Email: commander@america.com</p>
              <p>Password: password123</p>
            </div>
          </div>
      </div>
    </div>
  );
}