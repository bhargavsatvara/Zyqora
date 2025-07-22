const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Serve uploads directory statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes after models are defined
const router = require("./routes");
app.use('/api', router);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
    // Start server
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
        console.log(`Server running on port http://localhost:${port}`);
        console.log(`Swagger docs at http://localhost:${port}/api-docs`);
    });
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});