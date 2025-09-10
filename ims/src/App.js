import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import DashBoardPage from "./components/DashBoardPage/DashBoardPage";
import ProductsPage from "./components/ProductsPage/ProductsPage";
import OrdersPage from "./components/OrdersPage/OrdersPage"; 
import Sidebar from "./components/Sidebar/Sidebar";
import CustomerPage from "./components/CustomerPage/CustomerPage";
import AnalyticsPage from "./components/AnalyticsPage/AnalyticsPage";
import SettingsPage from "./components/SettingsPage/SettingsPage";

function App() {
  const [user, setUser] = useState(null);
  const [azureData, setAzureData] = useState(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const callAzureBackend = async () => {
    if (!user) {
      alert("Please sign in first");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/users`,
        {
          headers: {
            Authorization: `Bearer ${
              supabase.auth.session()?.access_token || ""
            }`,
          },
        }
      );
      const data = await res.json();
      setAzureData(data);
      console.log("Azure backend response:", data);
    } catch (error) {
      console.error("Error calling Azure backend:", error);
      setAzureData({ error: "Failed to connect to Azure database" });
    }
  };

  if (user) {
    return (
      <div>
        <h1>MRA Defense Inventory</h1>
        <p>Welcome, {user.email}!</p>
        <button onClick={handleSignOut}>Sign Out</button>
        
        <div style={{ marginTop: '20px' }}>
          <button onClick={callAzureBackend}>Call Azure Database</button>
          {azureData && (
            <div style={{ marginTop: '10px' }}>
              <h3>Azure Database Response:</h3>
              <pre>{JSON.stringify(azureData, null, 2)}</pre>
            </div>
          )}
  const [currentPage, setCurrentPage] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");

  const switchToRegister = () => {
    setCurrentPage("register");
  };

  const switchToLogin = () => {
    setCurrentPage("login");
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage("dashboard");
    setActivePage("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("login");
    setActivePage("dashboard");
  };

  const handleNavigation = (pageId) => {
    setActivePage(pageId);
  };

  // If user is logged in, show dashboard with sidebar
  if (isLoggedIn) {
    return (
      <div className="App">
        <Sidebar currentPage={activePage} onNavigate={handleNavigation} />
        <div className="main-content">
          {activePage === "dashboard" && <DashBoardPage onLogout={handleLogout} />}
          {activePage === "products" && <ProductsPage />}
          {activePage === "orders" && <OrdersPage />}
          {activePage === "customers" && <CustomerPage />}
          {activePage === "analytics" && <AnalyticsPage />}
          {activePage === "settings" && <SettingsPage />}

        </div>
      </div>
    );
  }

  return (
    <div>
      <Login />
  // If user is not logged in, show login/register
  return (
    <div className="App">
      {currentPage === "login" ? (
        <Login onSwitchToRegister={switchToRegister} onLogin={handleLogin} />
      ) : (
        <Register onSwitchToLogin={switchToLogin} onRegister={handleLogin} />
      )}
    </div>
  );
}

export default App;
