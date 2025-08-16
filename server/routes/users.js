const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

// GET /api/users/me (profile)
router.get('/me', verifyToken, userController.getProfile);

// PUT /api/users/me
router.put('/me', verifyToken, userController.updateProfile);

module.exports = router;
