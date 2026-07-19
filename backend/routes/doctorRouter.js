import express from 'express';
import multer from 'multer';
import os from 'os';

import { createDoctor, deleteDoctor, doctorLogin, getDoctorById, getDoctors, toggleAvailability, updateDoctor } from '../controllers/doctorController.js';
import doctorAuth from '../middlewares/doctorAuth.js';

const upload = multer({ dest: os.tmpdir() });
const doctorRouter = express.Router();

// static routes first
doctorRouter.get("/", getDoctors);
doctorRouter.post("/", upload.single("image"), createDoctor);
doctorRouter.post("/login", doctorLogin);

// dynamic /:id routes last
doctorRouter.get("/:id", getDoctorById);
doctorRouter.put("/:id", doctorAuth, upload.single("image"), updateDoctor);
doctorRouter.post("/:id/toggle-availability", doctorAuth, toggleAvailability);
doctorRouter.delete("/:id", deleteDoctor);

export default doctorRouter;