const express = require('express');
const router = express.Router();
const { triggerSOS, getSosHistory, decryptSosReport } = require('../controllers/sosController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @route   POST api/sos
 * @desc    Verify and log a new SOS event from a user
 * @access  Private (requires a valid JWT)
 */
router.post('/', authMiddleware, triggerSOS);

router.get('/', getSosHistory); // <-- ADD THIS LINE
router.get('/:id/decrypt', decryptSosReport);

module.exports = router;