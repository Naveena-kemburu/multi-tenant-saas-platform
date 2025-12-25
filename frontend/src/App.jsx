import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/health`);
      const data = await response.json();
      setHealth(data);
      setError(null);
    } catch (err) {
      setError('Failed to connect to API');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Multi-Tenant SaaS Platform</h1>
        <p>Project & Task Management System</p>
      </header>
      
      <main className="App-main">
        <section className="health-check">
          <h2>System Status</h2>
          {loading && <p>Checking server health...</p>}
          {error && <div className="error">{error}</div>}
          {health && health.success && (
            <div className="success">
              <p>✓ Server is healthy</p>
              <p>Database: Connected</p>
              <p>Timestamp: {new Date(health.data.timestamp).toLocaleString()}</p>
            </div>
          )}
        </section>

        <section className="features">
          <h2>Key Features</h2>
          <ul>
            <li>Multi-tenant architecture with complete data isolation</li>
            <li>JWT-based authentication with 24-hour token expiry</li>
            <li>Role-based access control (Super Admin, Tenant Admin, User)</li>
            <li>Project and task management system</li>
            <li>Subscription plans (Free, Pro, Enterprise)</li>
            <li>Comprehensive audit logging</li>
            <li>Docker containerization for easy deployment</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
