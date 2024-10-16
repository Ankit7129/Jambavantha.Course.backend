const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  educationalBackground: { type: String, required: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String }, // For password reset
  resetPasswordExpires: { type: Date }, // For expiration of reset token
  coursesEnrolled: [{ courseID: String, courseName: String }],
  isVerified: { type: Boolean, default: false }, // Add this line for email verification

});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
