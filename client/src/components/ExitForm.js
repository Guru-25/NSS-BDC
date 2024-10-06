import React, { useState } from 'react';
import axios from 'axios';
import './ExitForm.css'; // Import the CSS file

const ExitForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [donated, setDonated] = useState(false);
  const [error, setError] = useState('');

  // Handle input changes to allow only digits and limit to 10 characters
  const handleChange = (e) => {
    let input = e.target.value;
    const sanitizedInput = input.replace(/\D/g, ''); // Only allow digits
    if (sanitizedInput.length <= 10) {
      setPhoneNumber(sanitizedInput);
    }
  };

  const handleFetch = async (e) => {
    e.preventDefault();
    console.log('Fetching user details for phone number:', phoneNumber);

    if (phoneNumber.length !== 10) {
      setError('Phone number must contain exactly 10 digits');
      setUserDetails(null);
      return;
    }

    try {
      const response = await axios.get(`/api/user/${phoneNumber}`);
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
    console.log('Confirming donation for phone number:', phoneNumber, 'with donated status:', donated);

    if (phoneNumber.length !== 10) {
      setError('Phone number must contain exactly 10 digits');
      return;
    }

    try {
      const response = await axios.post('/api/confirm-donation', { phoneNumber, donated });
      console.log('Response from server:', response);
      alert('Donation changed to ' + (donated ? 'Yes' : 'No'));

      // Clear form and states after confirmation
      setPhoneNumber(''); // Clear phone number
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
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={handleChange}
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
