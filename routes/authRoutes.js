const express = require('express');
const { sendResetEmail, resetPassword ,verifyEmail ,  sendVerificationEmail , resendVerificationEmail } = require('../controllers/authController');
const router = express.Router();

// Send reset password email
router.post('/forgot-password', sendResetEmail);

// Reset password using token
router.post('/reset-password/:token', resetPassword);

// Verify email address
router.get('/verify-email/:token', verifyEmail); // Add the verification route

// Resend verification email
router.post('/send-verification-email', sendVerificationEmail); // Add the resend email route
router.post('/resend-verification-email', resendVerificationEmail); // Add the resend email route

module.exports = router;


