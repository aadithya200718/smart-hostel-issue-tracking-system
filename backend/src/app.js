const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const authRouter = require('./routes/authRoutes');
const issueRouter = require('./routes/issueRoutes');
const userRouter = require('./routes/userRoutes');
const auxRouter = require('./routes/auxRoutes');
const analyticsRouter = require('./routes/analyticsRoutes');
const rateLimit = require('express-rate-limit');

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Routes Placeholder
app.get('/', (req, res) => {
    res.json({ message: 'Smart Hostel API is running' });
});

app.use('/api/auth', authRouter);
app.use('/api/issues', issueRouter);
app.use('/api/users', userRouter);
app.use('/api/aux', auxRouter);
app.use('/api/analytics', analyticsRouter);

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({ status: 'fail', message: `Not Found - ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
});

module.exports = app;
