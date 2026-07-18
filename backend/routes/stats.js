import express from 'express';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import Service from '../models/Service.js';
import ServiceAppointment from '../models/serviceAppointment.js';
import { clerkClient } from '@clerk/express';

const statsRouter = express.Router();

statsRouter.get('/summary', async (req, res) => {
    try {
        const [
            totalDoctors,
            totalServices,
            totalAppointments,
            totalServiceAppointments,
            completed,
            cancelled,
            pending,
            confirmed,
            serviceCompleted,
            serviceCancelled,
            earningsAgg,
            serviceEarningsAgg,
        ] = await Promise.all([
            Doctor.countDocuments(),
            Service.countDocuments(),
            Appointment.countDocuments(),
            ServiceAppointment.countDocuments(),
            Appointment.countDocuments({ status: "Completed" }),
            Appointment.countDocuments({ status: "Canceled" }),
            Appointment.countDocuments({ status: "Pending" }),
            Appointment.countDocuments({ status: "Confirmed" }),
            ServiceAppointment.countDocuments({ status: "Completed" }),
            ServiceAppointment.countDocuments({ status: "Canceled" }),
            Appointment.aggregate([
                { $match: { status: "Completed", "payment.status": "Paid" } },
                { $group: { _id: null, total: { $sum: "$fees" } } },
            ]),
            ServiceAppointment.aggregate([
                { $match: { status: "Completed", "payment.status": "Paid" } },
                { $group: { _id: null, total: { $sum: "$fees" } } },
            ]),
        ]);

        const totalEarnings = (earningsAgg[0]?.total || 0) + (serviceEarningsAgg[0]?.total || 0);

        return res.json({
            success: true,
            data: {
                totalDoctors,
                totalServices,
                totalAppointments: totalAppointments + totalServiceAppointments,
                doctorAppointments: totalAppointments,
                serviceAppointments: totalServiceAppointments,
                completed: completed + serviceCompleted,
                cancelled: cancelled + serviceCancelled,
                pending,
                confirmed,
                totalEarnings,
            },
        });
    } catch (err) {
        console.error("stats/summary error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

statsRouter.get('/users/count', async (req, res) => {
    try {
        const count = await clerkClient.users.getCount();
        return res.json({ success: true, count });
    } catch (err) {
        console.error("users/count error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

export default statsRouter;