const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

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
  // email: String,
  donated: Boolean
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

// API Routes
app.post('/api/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send('User registered');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
});

// Route to fetch user by phone number or register number
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
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Error fetching user');
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
      res.status(404).send('User not found');
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