const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  createdBy: { type: String, required: true }, // College ID
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
