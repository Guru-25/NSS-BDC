import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import EntryForm from './components/EntryForm';
import ExitForm from './components/ExitForm';
import './App.css';

const App = () => {
  const [authenticated, setAuthenticated] = useState(Cookies.get('authenticated') === 'true');

  const handleLogin = async (username, password) => {
    try {
      // Make API call to the server for login validation
      const response = await axios.post('/api/login', { username, password });
      
      if (response.status === 200) {
        Cookies.set('authenticated', 'true', { expires: 1 }); // Set authenticated cookie
        setAuthenticated(true);
      }
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    Cookies.remove('authenticated');
    setAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={authenticated ? <Home onLogout={handleLogout} /> : <Login onLogin={handleLogin} />} />
          <Route path="/entry" element={authenticated ? <EntryForm /> : <Navigate to="/" replace />} />
          <Route path="/exit" element={authenticated ? <ExitForm /> : <Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

const Home = ({ onLogout }) => (
  <div className="home-container">
    <h1>NSS BDC</h1>
    <br></br>
    <h3>Welcome Admin ✨</h3>
    <button onClick={onLogout}>Logout</button>
    <div className="home-buttons">
      <button onClick={() => window.location.href = '/entry'}>Entry</button>
      <button onClick={() => window.location.href = '/exit'}>Exit</button>
      <button onClick={() => window.open('https://charts.mongodb.com/charts-nss-sozoxrc/public/dashboards/7ae27512-8b16-4f3e-8ad9-731b647670d7', '_blank')}>Chart</button>
    </div>
  </div>
);

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
  );
};

export default App;