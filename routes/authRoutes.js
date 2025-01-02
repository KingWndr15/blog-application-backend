const express = require('express');
const { signup, signin } = require('../controllers/authController');
const router = express.Router();

// Signup and Signin Routes
router.post('/signup', signup);
router.post('/signin', signin);

module.exports = router;
