import { useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const [currentPage, setCurrentPage] = useState("login");

  const switchToRegister = () => {
    setCurrentPage("register");
  };

  const switchToLogin = () => {
    setCurrentPage("login");
  };

  return (
    <div className="App">
      {currentPage === "login" ? (
        <Login onSwitchToRegister={switchToRegister} />
      ) : (
        <Register onSwitchToLogin={switchToLogin} />
      )}
    </div>
  );
}

export default App;