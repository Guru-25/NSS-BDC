import React, { useState } from 'react';
import axios from 'axios';
import './ExitForm.css'; // Import the CSS file

const ExitForm = () => {
  const [searchType, setSearchType] = useState('register'); // 'register' or 'phone'
  const [searchValue, setSearchValue] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [donated, setDonated] = useState(false);
  const [error, setError] = useState('');

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSearchValue(''); // Clear the search value when switching type
    setError('');
    setUserDetails(null);
  };

  const handleSearchValueChange = (e) => {
    let input = e.target.value;
    if (searchType === 'phone') {
      const sanitizedInput = input.replace(/\D/g, ''); // Only allow digits for phone
      if (sanitizedInput.length <= 10) {
        setSearchValue(sanitizedInput);
      }
    } else {
      setSearchValue(input); // Allow any input for register number
    }
  };

  const handleFetch = async (e) => {
    e.preventDefault();
    console.log(`Fetching user details for ${searchType}:`, searchValue);

    if (searchType === 'phone' && searchValue.length !== 10) {
      setError('Phone number must contain exactly 10 digits');
      setUserDetails(null);
      return;
    }

    try {
      const response = await axios.get(`/api/user/${searchType}/${searchValue}`);
      console.log('Response from server:', response);
      if (response.data) {
        setUserDetails(response.data);
        setDonated(response.data.donated);
        setError(`Fetched at ${new Date().toLocaleTimeString()}`);
      } else {
        setUserDetails(null);
        setError('No user found');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setUserDetails(null);
      setError('No user found');
    }
  };

  const handleConfirm = async () => {
    console.log('Confirming donation for', searchType, ':', searchValue, 'with donated status:', donated);
  
    if (searchType === 'phone' && searchValue.length !== 10) {
      setError('Phone number must contain exactly 10 digits');
      return;
    }
  
    try {
      const response = await axios.post('/api/confirm-donation', { 
        [searchType]: searchValue, 
        donated 
      });
      console.log('Response from server:', response);
      alert('Donation changed to ' + (donated ? 'Yes' : 'No'));
  
      // Clear form and states after confirmation
      setSearchValue(''); // Clear search value
      setUserDetails(null); // Clear user details
      setError(''); // Clear error messages
    } catch (error) {
      console.error('Error confirming donation:', error);
      setError('Failed to confirm donation');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleFetch} className="exit-form">
        <h2>Fetch User Details</h2>
        <div className="search-type-selector">
          <label>
            <input
              type="radio"
              value="register"
              checked={searchType === 'register'}
              onChange={handleSearchTypeChange}
            />
            Register Number &nbsp;
          </label>
          <label>
            <input
              type="radio"
              value="phone"
              checked={searchType === 'phone'}
              onChange={handleSearchTypeChange}
            />
            Phone Number
          </label>
        </div>
        <input
          type="text"
          placeholder={searchType === 'register' ? "Register Number" : "Phone Number"}
          value={searchValue}
          onChange={handleSearchValueChange}
          required
        />
        <button type="submit">Fetch User</button>
      </form>
      {error && <p className="error">{error}</p>}
      {userDetails && (
        <div className="user-details">
          <p><strong>Name:</strong> {userDetails.name}</p>
          <p><strong>Age:</strong> {userDetails.age}</p>
          <p><strong>Blood Group:</strong> {userDetails.blood}</p>
          <label>
            <strong>Donated:</strong>&nbsp;
            <select value={donated ? 'yes' : 'no'} onChange={(e) => setDonated(e.target.value === 'yes')}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
          <button onClick={handleConfirm}>Confirm Donation</button>
        </div>
      )}
      <nav className="footer-nav">
        <button onClick={() => window.location.href = '/'}>Home</button>&nbsp;
        <button onClick={() => window.location.href = '/entry'}>Entry</button>&nbsp;
        <button onClick={() => window.open('https://charts.mongodb.com/charts-nss-sozoxrc/public/dashboards/7ae27512-8b16-4f3e-8ad9-731b647670d7', '_blank')}>Chart</button>
      </nav>
    </div>
  );
};

export default ExitForm;
