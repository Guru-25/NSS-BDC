const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();
const Excel = require('exceljs');
const moment = require('moment-timezone');

const app = express();

// Middleware
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI);

const UserSchema = new mongoose.Schema({
  name: String,
  gender: String,
  department: String,
  year: String,
  register: String,
  blood: String,
  dob: Date,
  age: Number,
  phone: String,
  donated: Boolean,
  timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // In a real-world scenario, you would verify against a database
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.get('/api/statistics', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const donatedUsers = await User.countDocuments({ donated: true });
    
    const totalMale = await User.countDocuments({ gender: 'Male' });
    const totalFemale = await User.countDocuments({ gender: 'Female' });
    
    const donatedMale = await User.countDocuments({ donated: true, gender: 'Male' });
    const donatedFemale = await User.countDocuments({ donated: true, gender: 'Female' });

    res.json({
      totalUsers,
      donatedUsers,
      totalMale,
      totalFemale,
      donatedMale,
      donatedFemale
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).send('Error fetching statistics');
  }
});

app.get('/api/export-users', async (req, res) => {
  try {
    const users = await User.find({});

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    // Add headers
    worksheet.addRow(['Timestamp', 'Name', 'Gender', 'Age', 'Blood Group', 'Phone', 'Donated', 'Department', 'Year', 'Register Number']);

    // Add data
    users.forEach(user => {
      const timestamp = user.timestamp 
        ? moment(user.timestamp).tz('Asia/Kolkata').format('D/M/YYYY HH:mm:ss')
        : '';
      worksheet.addRow([
        timestamp,
        user.name,
        user.gender,
        user.age,
        user.blood,
        user.phone,
        user.donated ? 'Yes' : 'No',
        user.department,
        user.year,
        user.register,
      ]);
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');

    // Write to response
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Error exporting donors:', error);
    res.status(500).send('Error exporting donors');
  }
});

// API Routes
app.post('/api/register', async (req, res) => {
  try {
    const userData = { ...req.body, timestamp: new Date() };
    const user = new User(userData);
    await user.save();
    res.status(201).send('Donor registered');
  } catch (error) {
    console.error('Error registering donor:', error);
    res.status(500).send('Error registering donor');
  }
});

// Route to fetch donor by phone number or register number
app.get('/api/user/:type/:value', async (req, res) => {
  try {
    const { type, value } = req.params;
    let user;

    if (type === 'phone') {
      user = await User.findOne({ phone: value });
    } else if (type === 'register') {
      user = await User.findOne({ register: value });
    } else {
      return res.status(400).send('Invalid search type');
    }

    if (user) {
      res.json(user);
    } else {
      res.status(404).send('Donor not found');
    }
  } catch (error) {
    console.error('Error fetching donor:', error);
    res.status(500).send('Error fetching donor');
  }
});

// Route to confirm donation
app.post('/api/confirm-donation', async (req, res) => {
  try {
    const { phone, register, donated } = req.body;
    let user;

    if (phone) {
      user = await User.findOne({ phone });
    } else if (register) {
      user = await User.findOne({ register });
    } else {
      return res.status(400).send('Either phone or register number is required');
    }

    if (user) {
      user.donated = donated;
      await user.save();
      if (donated === true) {
        // Email sending logic (commented out in your original code)
        res.send('Donation confirmed');
      } else {
        res.send('Donation status updated');
      }
    } else {
      res.status(404).send('Donor not found');
    }
  } catch (error) {
    console.error('Error confirming donation:', error);
    res.status(500).send('Error confirming donation');
  }
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});