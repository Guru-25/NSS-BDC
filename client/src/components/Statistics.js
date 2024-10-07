import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Statistics.css'; // Updated CSS file
import ExportButton from './ExportButton';

const Statistics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    donatedUsers: 0,
    totalMale: 0,
    totalFemale: 0,
    donatedMale: 0,
    donatedFemale: 0
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('/api/statistics');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setError('Failed to fetch statistics');
      }
    };

    fetchStatistics();
  }, []);

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="statistics">
      <h2>BDC Statistics</h2>
      <div className="stat-grid">
        <div className="stat-section">
          <h3>Registered Donors</h3>
          <div className="stat-item">
            <strong>Total:</strong> {stats.totalUsers}
          </div>
          <div className="stat-item">
            <strong>Male:</strong> {stats.totalMale}
          </div>
          <div className="stat-item">
            <strong>Female:</strong> {stats.totalFemale}
          </div>
        </div>
        <div className="stat-section">
          <h3>Donated Donors</h3>
          <div className="stat-item">
            <strong>Total:</strong> {stats.donatedUsers}
          </div>
          <div className="stat-item">
            <strong>Male:</strong> {stats.donatedMale}
          </div>
          <div className="stat-item">
            <strong>Female:</strong> {stats.donatedFemale}
          </div>
        </div>
      </div>
      <ExportButton />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
    <nav className="footer-nav">
    <button onClick={() => window.location.href = '/'}>Home</button>
  </nav>
  </div>
  );
};

export default Statistics;
