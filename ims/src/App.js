import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
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
  const [currentPage, setCurrentPage] = useState("login");
  const [activePage, setActivePage] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const switchToRegister = () => {
    setCurrentPage("register");
  };

  const switchToLogin = () => {
    setCurrentPage("login");
  };

  const handleLogin = () => {
    setCurrentPage("dashboard");
    setActivePage("dashboard");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentPage("login");
    setActivePage("dashboard");
  };

  const handleNavigation = (pageId) => {
    setActivePage(pageId);
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="App" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>Loading...</div>
      </div>
    );
  }

  // If user is logged in, show dashboard with sidebar
  if (user) {
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
