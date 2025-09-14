const User = require('../models/User');
const io = require('../utils/socket').getIO();
const Sos = require('../models/Sos')

/**
 * @desc    Get all registered users (for the initial admin map load)
 * @route   GET /api/users
 */
exports.getAllUsers = async (req, res) => {
    try {
        // Only return necessary, non-sensitive data for the map
        const users = await User.find().select('walletAddress lastLocation');
        res.json(users);
    } catch (err) {
        console.error("Get Users Error:", err);
        res.status(500).send("Server Error");
    }
};

/**
 * @desc    Receive and broadcast a location update from a logged-in user
 * @route   POST /api/users/location
 */
exports.updateUserLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        // req.user is attached by the authMiddleware from the JWT
        const user = await User.findById(req.user.id); 

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        user.lastLocation = {
            type: 'Point',
            coordinates: [longitude, latitude]
        };
        await user.save();
        
        // Broadcast the location update to all connected admin clients via WebSocket
        io.emit('locationUpdate', { 
            _id: user._id, // Use _id to match the user on the frontend
            walletAddress: user.walletAddress,
            lastLocation: user.lastLocation 
        });

        res.json({ msg: 'Location updated successfully' });
    } catch (err) {
        console.error("Update Location Error:", err);
        res.status(500).send("Server Error");
    }
};

// --- ADD THIS NEW FUNCTION ---
/**
 * @desc    Get all users with their current safety status
 * @route   GET /api/users/status
 */
exports.getUsersWithStatus = async (req, res) => {
    try {
        // 1. Fetch all users
        const users = await User.find().select('walletAddress lastLocation createdAt');

        // 2. Find all active SOS events
        const activeSosEvents = await Sos.find({ status: 'active' }).select('tourist');
        const usersInDanger = new Set(activeSosEvents.map(sos => sos.tourist.toString()));

        // 3. Combine the data to determine status
        const usersWithStatus = users.map(user => {
            const status = usersInDanger.has(user._id.toString()) ? 'In Danger' : 'Safe';
            return {
                _id: user._id,
                walletAddress: user.walletAddress,
                lastLocation: user.lastLocation,
                createdAt: user.createdAt,
                status: status,
            };
        });

        res.json(usersWithStatus);
    } catch (err) {
        console.error("Get Users with Status Error:", err);
        res.status(500).send("Server Error");
    }
};