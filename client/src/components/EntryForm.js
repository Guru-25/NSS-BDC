import React, { useState } from 'react';
import axios from 'axios';
import './EntryForm.css'; // Import the CSS file

const EntryForm = () => {
  const initialFormData = {
    name: '',
    gender: '',
    department: '',
    age: '',
    register: '',
    email: '',
    phone: '',
    blood: '',
    year: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    // Ensure phone input has no spaces and only numeric values
    if (e.target.name === 'phone') {
      const cleanedValue = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
      setFormData({ ...formData, phone: cleanedValue });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Trim any spaces in phone and validate its length
    const trimmedPhone = formData.phone.trim();
    
    if (trimmedPhone.length !== 10) {
      alert('Phone number must be exactly 10 digits');
      return;
    }
    
    try {
      const response = await axios.post('/api/register', { ...formData, phone: trimmedPhone });
      console.log('User details submitted:', response.data);
      alert('User registered');
      setFormData(initialFormData); // Reset the form after successful submission
    } catch (error) {
      console.error('Error submitting user details:', error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="entry-form">
        <h2>Register User</h2>
        <input type="text" name="name" placeholder="Name *" value={formData.name} onChange={handleChange} required />
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender *</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input type="number" name="age" placeholder="Age *" value={formData.age} onChange={handleChange} required />
        <select name="blood" value={formData.blood} onChange={handleChange} required>
          <option value="">Select Blood Group *</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
        <input 
          type="text" 
          name="phone" 
          placeholder="Phone *" 
          value={formData.phone} 
          onChange={handleChange} 
          required 
          maxLength="10" // Optional: You can limit the input length to 10
        />
        <select name="department" value={formData.department} onChange={handleChange}>
          <option value="">Select Department</option>
          <option value="AIML">AIML</option>
          <option value="AMCS">AMCS</option>
          <option value="Civil">Civil</option>
          <option value="CSBS">CSBS</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="EEE">EEE</option>
          <option value="IT">IT</option>
          <option value="MECH">MECH</option>
          <option value="MECT">MECT</option>
        </select>
        <select name="year" value={formData.year} onChange={handleChange}>
          <option value="">Select Year</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
        <input type="text" name="register" placeholder="Register No." value={formData.register} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
      <nav className="footer-nav">
        <button onClick={() => window.location.href = '/'}>Home</button>&nbsp;
        <button onClick={() => window.location.href = '/exit'}>Exit</button>&nbsp;
        <button onClick={() => window.open('https://charts.mongodb.com/charts-nss-sozoxrc/public/dashboards/7ae27512-8b16-4f3e-8ad9-731b647670d7', '_blank')}>Chart</button>
      </nav>
    </div>
  );
};

export default EntryForm;
