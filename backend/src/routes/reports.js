const express = require('express');
const router = express.Router();
router.post('/', (req, res) => res.status(501).json({ msg: "Not implemented" }));
module.exports = router;