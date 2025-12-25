import React, { useState, useEffect } from "react";
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { checkHealth(); }, []);

  const checkHealth = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/health`);
      const data = await res.json();
      setHealth(data);
      setError(null);
    } catch (err) {
      setError('Failed to connect to API');
      setHealth(null);
    } finally { setLoading(false); }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Multi-Tenant SaaS Platform</h1>
      </header>
      <main>
        {loading && <p>Checking server health...</p>}
        {error && <p>{error}</p>}
        {health && health.success && <p>Server is healthy</p>}
      </main>
    </div>
  );
}

export default App;
