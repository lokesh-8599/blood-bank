// backend/routes/admin.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const Recipient = require('../models/Recipient');
const Inventory = require('../models/Inventory'); // include inventory model

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const admin = await User.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (admin.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Not an admin' });
    }

    const isMatch = (password === admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is not defined in .env');
      return res.status(500).json({ message: 'Internal server configuration error' });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('✅ Admin login successful for:', admin.email);

    res.status(200).json({
      message: 'Admin login successful',
      token,
      user: {
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (err) {
    console.error('❌ Admin login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ✅ GET /api/admin/requests - Fetch all requests with recipient info
router.get('/requests', async (req, res) => {
  try {
    const requests = await BloodRequest.find().sort({ date: -1 });
    const recipients = await Recipient.find();
    const recipientMap = {};
    recipients.forEach(r => recipientMap[r.email] = r.name);

    const formatted = requests.map(req => ({
      _id: req._id,
      email: req.email,
      name: recipientMap[req.email] || '-',
      bloodGroup: req.bloodGroup,
      location: req.location,
      reason: req.reason,
      date: req.date,
      status: req.status
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error('❌ Failed to get requests:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/requests/:id
router.put('/requests/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate the status value
  if (!['Pending', 'Approved', 'Denied'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const updated = await BloodRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }  // IMPORTANT: Ensures validations run
    );

    if (!updated) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({ message: `Request marked as ${status}` });

  } catch (err) {
    console.error("❌ Status update error:", err.message);
    res.status(500).json({ message: err.message });  // Return detailed error
  }
});

// ✅ DELETE request by ID (preserved from original)
router.delete('/requests/:id', async (req, res) => {
  try {
    const deleted = await BloodRequest.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json({ message: 'Request deleted successfully' });
  } catch (err) {
    console.error('❌ Delete request error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ GET all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['donor', 'recipient'] } }).select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

router.get('/adminstats', async (req, res) => {
  try {
    const totalDonors = await User.countDocuments({ role: 'donor' });
    const totalRecipients = await User.countDocuments({ role: 'recipient' });
    const pendingRequests = await BloodRequest.countDocuments({ status: 'Pending' });
   res.status(200).json({
  donors: totalDonors,
  recipients: totalRecipients,
  requests: pendingRequests,
});
  } catch (err) {
    console.error("❌ Error loading admin stats:", err.message);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
});

module.exports = router;