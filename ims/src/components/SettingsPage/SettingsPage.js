import { useState } from "react";
import "./SettingsPage.css";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const [settings, setSettings] = useState({
    username: "Cmdr_Shepard",
    email: "shepard@normandy-sr2.com",
    lowStockAlerts: true,
    newOrderEmails: true,
    systemUpdates: false,
    theme: "default",
    dataDensity: "compact",
  });

  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <div className="settings-section">
            <h3 className="section-title">User Account</h3>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" value={settings.username} onChange={handleSettingChange} className="settings-input" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" value={settings.email} onChange={handleSettingChange} className="settings-input" />
            </div>
             <div className="form-group">
                <label>Password</label>
                <button className="settings-btn secondary">Change Password</button>
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="settings-section">
            <h3 className="section-title">Notification Preferences</h3>
            <div className="form-group toggle">
              <label htmlFor="lowStockAlerts">Low Stock Alerts</label>
              <label className="toggle-switch">
                <input type="checkbox" id="lowStockAlerts" name="lowStockAlerts" checked={settings.lowStockAlerts} onChange={handleSettingChange} />
                <span className="slider"></span>
              </label>
            </div>
            <div className="form-group toggle">
              <label htmlFor="newOrderEmails">New Order Emails</label>
              <label className="toggle-switch">
                <input type="checkbox" id="newOrderEmails" name="newOrderEmails" checked={settings.newOrderEmails} onChange={handleSettingChange} />
                <span className="slider"></span>
              </label>
            </div>
            <div className="form-group toggle">
              <label htmlFor="systemUpdates">System Update Briefings</label>
              <label className="toggle-switch">
                <input type="checkbox" id="systemUpdates" name="systemUpdates" checked={settings.systemUpdates} onChange={handleSettingChange} />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        );
      case "preferences":
        return (
          <div className="settings-section">
            <h3 className="section-title">Application Preferences</h3>
            <div className="form-group">
              <label htmlFor="theme">Visual Theme</label>
              <select id="theme" name="theme" value={settings.theme} onChange={handleSettingChange} className="settings-select">
                <option value="default">Armory Default (Dark)</option>
                <option value="high_contrast">High Contrast</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="dataDensity">Data Density</label>
              <select id="dataDensity" name="dataDensity" value={settings.dataDensity} onChange={handleSettingChange} className="settings-select">
                <option value="compact">Compact</option>
                <option value="comfortable">Comfortable</option>
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="military-settings-container">
      <div className="dashboard-camouflage"></div>

      <header className="settings-header">
        <h1 className="settings-title">SYSTEM CONFIGURATION</h1>
      </header>

      <main className="settings-content">
        <div className="settings-layout">
          <div className="settings-tabs">
            <button className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`} onClick={() => setActiveTab('account')}>Account</button>
            <button className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>Notifications</button>
            <button className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`} onClick={() => setActiveTab('preferences')}>Preferences</button>
          </div>
          <div className="settings-panel">
            {renderContent()}
            <div className="action-bar">
                <button className="settings-btn primary">Save Changes</button>
                <button className="settings-btn danger">Reset to Default</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}