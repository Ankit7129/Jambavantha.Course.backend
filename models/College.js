const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  collegeName: { type: String, required: true },
  adminEmail: { type: String, required: true, unique: true },
  registrationNumber: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String }, // For password reset
  resetPasswordExpires: { type: Date }, // For expiration of reset token
  courses: [{ courseID: String, courseName: String, description: String }],
  isVerified: { type: Boolean, default: false }, // Add this line for email verification

});

const College = mongoose.model('College', collegeSchema);
module.exports = College;
