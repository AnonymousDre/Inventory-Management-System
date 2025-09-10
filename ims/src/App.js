import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Login from "./components/Login";

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
        </div>
      </div>
    );
  }

  return (
    <div>
      <Login />
    </div>
  );
}

export default App;
