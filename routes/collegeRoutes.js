const express = require('express');
const router = express.Router();
const {
    registerCollege,
    loginCollege,
    logoutCollege,
    verifyEmail // Add the verifyEmail function
    
} = require('../controllers/collegeController');

// Register college
router.post('/register', registerCollege);

// Login college
router.post('/login', loginCollege);

// Logout college
router.post('/logout', logoutCollege); // Logout route



module.exports = router;
