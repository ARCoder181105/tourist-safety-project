const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
// const adminAuth = require('../middleware/adminAuth'); // Protect this route

// GET /api/dashboard/stats - Get all dashboard stats
router.get('/stats', getDashboardStats);

module.exports = router;