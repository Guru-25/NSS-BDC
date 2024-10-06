const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
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
  email: String,
  donated: Boolean
});

const User = mongoose.model('User', UserSchema);

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

app.get('/api/user/:phoneNumber', async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phoneNumber });
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

app.post('/api/confirm-donation', async (req, res) => {
  try {
    const { phoneNumber, donated } = req.body;
    const user = await User.findOne({ phone: phoneNumber });
    if (user) {
      user.donated = donated;
      await user.save();
      if (donated === true) {
        if (user.email) {
          const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: 465,
            secure: true,
            auth: {
              user: process.env.USER,
              pass: process.env.PASSWORD
            }
          });
          const mailOptions = {
            from: process.env.USER,
            to: user.email,
            subject: 'Thank you for donating blood',
            text: `Dear ${user.name}, thank you for donating blood.`
          };
          await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log('Error sending email:', error);
              return res.status(500).send('Error sending email');
            }
            console.log('Email sent:', info.response);
            res.send('Donation confirmed and thank you email sent');
          });
          res.send('Donation confirmed and thank you email sent');
        } else {
          res.send('Donation confirmed');
        }
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