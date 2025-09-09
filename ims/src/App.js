import Register from "./components/Register";
import Login from "./components/Login";
import "./styles/login.css";
import "./styles/register.css";
import { useState } from "react";

function App() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div>
      {showRegister ? (
        <Register onShowLogin={() => setShowRegister(false)} />
      ) : (
        <Login onShowRegister={() => setShowRegister(true)} />
      )}
    </div>
  );
}

export default App;