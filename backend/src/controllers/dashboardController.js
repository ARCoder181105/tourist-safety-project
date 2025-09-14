const User = require('../models/User');
const Sos = require('../models/Sos');
const Report = require('../models/Report');
const Zone = require('../models/Zone'); // Assuming you created Zone.js model

// @desc    Get aggregated stats for the admin dashboard
exports.getDashboardStats = async (req, res) => {
    try {
        const [userCount, activeSosCount, reportCount, zoneCount] = await Promise.all([
            User.countDocuments(),
            Sos.countDocuments({ status: 'active' }),
            Report.countDocuments(),
            Zone.countDocuments() // This will work once you implement the Zone model
        ]);

        res.json({
            activeUsers: userCount,
            activeSOS: activeSosCount,
            hazardReports: reportCount,
            dangerZones: zoneCount,
        });

    } catch (err) {
        console.error("Dashboard Stats Error:", err);
        res.status(500).send("Server Error");
    }
};