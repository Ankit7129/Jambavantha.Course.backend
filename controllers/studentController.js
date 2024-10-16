const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const { sendVerificationEmail } = require('./authController'); // Import the email function from authController

// Register a new student
const registerStudent = async (req, res) => {
    const { name, email, phoneNumber, educationalBackground, password } = req.body;

    try {
        // Check if student exists
        let student = await Student.findOne({ email });
        if (student) return res.status(400).json({ message: 'Student already exists' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create student
        student = new Student({
            name,
            email,
            phoneNumber,
            educationalBackground,
            password: hashedPassword,
            isVerified: false // Email needs to be verified
        });

        await student.save();

        // Send email verification
        await sendVerificationEmail(student, 'student'); // Call from authController

        res.status(201).json({ message: 'Student registered successfully, please verify your email' });
    } catch (error) {
        console.error('Error registering student:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login a student
const loginStudent = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if student exists
        let student = await Student.findOne({ email });
        if (!student) return res.status(400).json({ message: 'Invalid credentials' });

        // Check if the email is verified
        if (!student.isVerified) {
            return res.status(400).json({ message: 'Email not verified. Please verify your email before logging in.' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Return JWT
        const payload = { studentID: student.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Logout a student
const logoutStudent = (req, res) => {
    // Here we usually clear the token from the client-side
    // For this backend, we simply send a response confirming logout
    res.status(200).json({ message: 'Logout successful' });
};

module.exports = {
    registerStudent,
    loginStudent,
    logoutStudent, // Include the logout function in the export
};
