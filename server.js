const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');


dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors());

// Define Routes
app.use('/api/students', require('./routes/studentRoutes')); // Student routes
app.use('/api/colleges', require('./routes/collegeRoutes')); // College routes
app.use('/api/auth', require('./routes/authRoutes')); // Authentication routes
// Serve React App (Catch-all route)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));

    // Catch-all route to serve the React app
    app.get('/api/example', (req, res) => {
        res.json({ message: 'Hello from the backend!' });
    });
}
// Listen to the port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
