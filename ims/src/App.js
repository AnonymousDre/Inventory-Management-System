import { useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import DashBoardPage from "./components/DashBoardPage/DashBoardPage";
import ProductsPage from "./components/ProductsPage/ProductsPage";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {
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