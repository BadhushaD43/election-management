import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SimpleLogin.css';

const SimpleLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Simulate login API call
    setTimeout(() => {
      console.log('Login attempt:', { email, password });
      setLoading(false);

      // Simple routing logic: navigate based on ID patterns
      const id = email.trim().toLowerCase();
      if (id.startsWith('bda')) {
        navigate('/bda');
      } else if (id.includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/survey');
      }
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="auth-card">
        <aside className="welcome-panel">
          <p className="welcome-tag">Election Survey</p>
          <h2>Welcome Back</h2>
          <p>Track participation, monitor responses, and manage survey sessions in one place.</p>
        </aside>

        <div className="login-box">

          <h1>Election Survey System</h1>
          <p className="subtitle">Sign in to create, publish, and review survey results.</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Username</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your username"
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <button className="login-button" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SimpleLogin;
