const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserLocation, getUsersWithStatus } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/users - Get all users for admin map
router.get('/', getAllUsers);

// POST /api/users/location - Update a user's live location
router.post('/location', authMiddleware, updateUserLocation);
router.get('/status', getUsersWithStatus); // You might want to protect this with 
module.exports = router;