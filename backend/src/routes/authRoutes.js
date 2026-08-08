const express = require('express');
const router = express.Router();
const authLimiter = require('../middlewares/rateLimiter');
const { register, login, refresh, logout } = require('../controllers/authController');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', logout);

module.exports = router;
