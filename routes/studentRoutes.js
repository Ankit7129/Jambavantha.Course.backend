const express = require('express');
const router = express.Router();
const { registerStudent, loginStudent, verifyEmail } = require('../controllers/studentController');

// Register a new student
router.post('/register', registerStudent);

// Login a student
router.post('/login', loginStudent);


module.exports = router;
