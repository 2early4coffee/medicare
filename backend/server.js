import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { clerkMiddleware } from '@clerk/express';
import { connectDB } from './config/db.js';
import doctorRouter from './routes/doctorRouter.js';
import serviceRouter from './routes/serviceRouter.js';
import appointmentRouter from './routes/appointmentRouter.js';
import serviceAppointmentRouter from './routes/serviceAppointmentRouter.js';
import statsRouter from './routes/stats.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 4000;

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://medicare-black-tau.vercel.app',
];

/* RATE LIMITERS */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: "Too many login attempts, please try again later." },
});

// ✅ Custom sanitizer function - defined before use
const sanitizeInput = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    for (const key of Object.keys(obj)) {
        if (key.startsWith('$') || key.includes('.')) {
            delete obj[key];
        } else if (typeof obj[key] === 'object') {
            sanitizeInput(obj[key]);
        }
    }
};

/* SECURITY MIDDLEWARES */
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));

/* CORS */
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

/* RATE LIMITING */
app.use('/api/', apiLimiter);

/* CLERK */
app.use(clerkMiddleware());

/* BODY PARSERS */
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// ✅ Custom sanitizer middleware - AFTER body parsers, BEFORE routes
app.use((req, res, next) => {
    if (req.body) sanitizeInput(req.body);
    if (req.params) sanitizeInput(req.params);
    next();
});

/* DATABASE */
connectDB();

/* ROUTES */
app.use('/api/doctors', doctorRouter);
app.use('/api/doctors/login', authLimiter);
app.use('/api/services', serviceRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/service-appointments', serviceAppointmentRouter);
app.use('/api/stats', statsRouter);

/* TEST ROUTE */
app.get('/', (req, res) => {
    res.send('API WORKING');
});

/* ERROR HANDLER */
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

/* START SERVER */
app.listen(port, () => {
    console.log(`🚀 Server Started on http://localhost:${port}`);
});