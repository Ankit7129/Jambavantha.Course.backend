const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const College = require('../models/College');
const { sendVerificationEmail } = require('./authController'); // Import the email function from authController
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000'; // Default to localhost if not in environment
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'; // Default to localhost if not in environment

// Register a new college
const registerCollege = async (req, res) => {
    const { collegeName, adminEmail, registrationNumber, phoneNumber, password } = req.body;

    try {
        // Check if the college exists
        let college = await College.findOne({ adminEmail });
        if (college) return res.status(400).json({ message: 'College already exists' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new college
        college = new College({
            collegeName,
            adminEmail,
            registrationNumber,
            phoneNumber,
            password: hashedPassword,
            isVerified: false // Email needs to be verified
        });

        await college.save();

        // Send email verification
        await sendVerificationEmail(college, 'college'); // Call from authController

        res.status(201).json({ message: 'College registered successfully, please verify your email' });
    } catch (error) {
        console.error('Error registering college:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login a college
const loginCollege = async (req, res) => {
    const { adminEmail, password } = req.body;

    try {
        // Check if the college exists
        let college = await College.findOne({ adminEmail });

        if (!college) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if the email is verified
        if (!college.isVerified) {
            return res.status(400).json({ message: 'Email not verified. Please verify your email before logging in.' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, college.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const payload = { collegeID: college.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            token,
            collegeID: college.id
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// Logout a college (optional)
const logoutCollege = (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
};


module.exports = {
    registerCollege,
    loginCollege,
    logoutCollege
};
