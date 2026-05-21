import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { clerkMiddleware } from '@clerk/express';

import { connectDB } from './config/db.js';

import doctorRouter from './routes/doctorRouter.js';
import serviceRouter from './routes/serviceRouter.js';
import appointmentRouter from './routes/appointmentRouter.js';
import serviceAppointmentRouter from './routes/serviceAppointmentRouter.js';

const app = express();
const port = process.env.PORT || 4000;

/* ALLOWED FRONTEND ORIGINS */

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
];

/* MIDDLEWARES */

// CORS
app.use(
    cors({
        origin: function (origin, callback) {

            // allow requests with no origin
            // (Postman, mobile apps, etc.)
            if (!origin) {
                return callback(null, true);
            }

            // allow listed origins
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            // reject unknown origins
            return callback(
                new Error('Not allowed by CORS')
            );
        },

        credentials: true,

        methods: [
            'GET',
            'POST',
            'PUT',
            'DELETE',
            'OPTIONS'
        ],

        allowedHeaders: [
            'Content-Type',
            'Authorization'
        ]
    })
);

// Clerk middleware
app.use(clerkMiddleware());

// Body parsers
app.use(express.json({ limit: '20mb' }));

app.use(
    express.urlencoded({
        limit: '20mb',
        extended: true
    })
);

/* DATABASE */

connectDB();

/* ROUTES  */

app.use('/api/doctors', doctorRouter);

app.use('/api/services', serviceRouter);

app.use('/api/appointments', appointmentRouter);

app.use(
    '/api/service-appointments',
    serviceAppointmentRouter
);

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
    console.log(
        `🚀 Server Started on http://localhost:${port}`
    );
});