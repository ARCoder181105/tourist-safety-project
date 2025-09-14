const express = require('express');
const router = express.Router();
const { register, login, getNonce,checkUser } = require('../controllers/authController');

/**
 * @route   POST api/auth/register
 * @desc    Register a new tourist, save them to the database, and register their identity on the blockchain.
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST api/auth/login
 * @desc    Authenticate a returning tourist by verifying a signed message.
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET api/auth/nonce/:walletAddress
 * @desc    Get a unique, temporary message (nonce) for a user to sign for login.
 * @access  Public
 */
router.get('/nonce/:walletAddress', getNonce);

// Add this line to your auth.js routes file
router.get('/check/:walletAddress', checkUser);

module.exports = router;
