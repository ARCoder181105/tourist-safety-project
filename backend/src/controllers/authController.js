const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');
const {decryptHybrid} = require('../utils/decryptor')
const JWT_SECRET = process.env.JWT_SECRET;
// In-memory nonce store for login challenges (replace with Redis in production)
const nonces = {};

// Get a unique message for a user to sign for login
exports.getNonce = (req, res) => {
    const { walletAddress } = req.params;
    const nonce = `Welcome to Sentinel! Please sign this message to log in. Nonce: ${Math.floor(Math.random() * 1000000)}`;
    nonces[walletAddress.toLowerCase()] = nonce;
    res.json({ nonce });
};

// Check if a wallet address is already registered
exports.checkUser = async (req, res) => {
    try {
        const user = await User.findOne({
            walletAddress: req.params.walletAddress.toLowerCase()
        });
        res.json({ isRegistered: !!user });
    } catch (err) {
        console.error("Check user error:", err);
        res.status(500).send("Server Error");
    }
};

// Register a new user's profile in the database
exports.register = async (req, res) => {
    try {
        // 1. GET the location from the request body
        const { walletAddress, encryptedCredentials, location } = req.body;

        if (!walletAddress || !encryptedCredentials || !location) {
            return res.status(400).json({ msg: "Wallet address, credentials, and location are required." });
        }

        const lowerCaseAddress = walletAddress.toLowerCase();

        if (await User.findOne({ walletAddress: lowerCaseAddress })) {
            return res.status(400).json({ msg: "User already registered." });
        }

        const credentialHash = ethers.keccak256(ethers.toUtf8Bytes(encryptedCredentials));
        const initialNonce = Math.floor(Math.random() * 1000000).toString();

        const user = new User({
            walletAddress: lowerCaseAddress,
            encryptedCredentials,
            credentialHash,
            nonce: initialNonce,
            // 2. SAVE the location to the database
            lastLocation: {
                type: 'Point',
                coordinates: [location.longitude, location.latitude] // GeoJSON format [lng, lat]
            },
        });
        await user.save();

        res.status(201).json({ msg: "Tourist profile created successfully. Please log in." });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).send("Server Error");
    }
};
// Verify a signed nonce and issue a JWT for a persistent session
exports.login = async (req, res) => {
    try {
        const { walletAddress, signature } = req.body;
        const lowerCaseAddress = walletAddress.toLowerCase();

        const user = await User.findOne({ walletAddress: lowerCaseAddress });
        if (!user) {
            return res.status(404).json({ msg: "User not found. Please register." });
        }
        
        const nonce = nonces[lowerCaseAddress];
        if (!nonce) {
            return res.status(400).json({ msg: "Please request a nonce first." });
        }
        
        const recoveredAddress = ethers.verifyMessage(nonce, signature);
        
        if (recoveredAddress.toLowerCase() !== lowerCaseAddress) {
            return res.status(401).json({ msg: "Signature verification failed." });
        }

        delete nonces[lowerCaseAddress];

        // --- THE FIX IS HERE ---
        // 2. Get the police private key from environment variables
        const policePrivateKey = process.env.POLICE_PRIVATE_KEY;
        if (!policePrivateKey) {
            throw new Error("Police private key is not configured on the server.");
        }
        
        // 3. Decrypt the credentials using the utility function
        const decryptedCreds = decryptHybrid(user.encryptedCredentials, policePrivateKey);

        const payload = { 
            user: { 
                id: user.id, 
                walletAddress: user.walletAddress 
            } 
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

        // 4. Send the now correctly decrypted credentials
        res.json({ 
            token, 
            credentials: decryptedCreds.credentials // The decrypted object has a `credentials` property
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).send("Server Error");
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        // Only return necessary, non-sensitive data
        const users = await User.find().select('walletAddress lastLocation');
        res.json(users);
    } catch (err) {
        console.error("Get Users Error:", err);
        res.status(500).send("Server Error");
    }
};

exports.updateUserLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const user = await User.findById(req.user.id); // req.user is from authMiddleware

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.lastLocation = {
            type: 'Point',
            coordinates: [longitude, latitude]
        };
        await user.save();

        // Broadcast the location update to all connected admin clients
        io.emit('locationUpdate', {
            userId: user._id,
            walletAddress: user.walletAddress,
            location: user.lastLocation
        });

        res.json({ msg: 'Location updated successfully' });
    } catch (err) {
        console.error("Update Location Error:", err);
        res.status(500).send("Server Error");
    }
};

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