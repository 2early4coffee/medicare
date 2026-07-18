import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import Doctor from '../models/Doctor.js';
import Service from '../models/Service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload image from URL to Cloudinary
async function uploadFromUrl(url, publicId, folder) {
    try {
        const result = await cloudinary.uploader.upload(url, {
            public_id: publicId,
            folder: folder,
            overwrite: true,
        });
        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (err) {
        console.warn(`⚠️ Failed to upload ${publicId}:`, err.message);
        return { url, publicId };
    }
}

// Generate schedule for next 14 days
function generateSchedule() {
    const schedule = {};
    const timeSlots = [
        "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM",
        "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
        "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
        "4:00 PM", "4:30 PM",
    ];

    for (let i = 1; i <= 14; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        if (date.getDay() === 0) continue; // Skip Sundays
        const dateStr = date.toISOString().split("T")[0];
        // Pick 6 random slots
        const shuffled = [...timeSlots].sort(() => Math.random() - 0.5);
        schedule[dateStr] = shuffled.slice(0, 6);
    }
    return schedule;
}

// Doctors data
const doctorsData = [
    {
        name: "Dr. Amina Wanjiku",
        email: "amina.wanjiku@medicare.co.ke",
        password: "Doctor@123",
        specialization: "Cardiologist",
        experience: "12 years",
        qualifications: "MBChB, MMed (Cardiology) - University of Nairobi",
        location: "Nairobi Hospital, Upper Hill",
        about: "Dr. Amina Wanjiku is a leading cardiologist with over 12 years of experience treating heart conditions. She has worked at Kenyatta National Hospital and now practices at Nairobi Hospital.",
        fee: 5000,
        availability: "Available",
        rating: 4.8,
        patients: "3000+",
        success: "97%",
        imageUrl: "https://i.pravatar.cc/300?u=amina.wanjiku@medicare.co.ke",
    },
    {
        name: "Dr. Brian Otieno",
        email: "brian.otieno@medicare.co.ke",
        password: "Doctor@123",
        specialization: "Pediatrician",
        experience: "8 years",
        qualifications: "MBChB, MMed (Pediatrics) - Moi University",
        location: "Aga Khan Hospital, Parklands",
        about: "Dr. Brian Otieno specializes in child health and development. He is known for his gentle approach with children and has treated thousands of young patients across Nairobi.",
        fee: 3500,
        availability: "Available",
        rating: 4.9,
        patients: "5000+",
        success: "99%",
        imageUrl: "https://i.pravatar.cc/300?u=brian.otieno@medicare.co.ke",
    },
    {
        name: "Dr. Grace Muthoni",
        email: "grace.muthoni@medicare.co.ke",
        password: "Doctor@123",
        specialization: "Gynecologist",
        experience: "15 years",
        qualifications: "MBChB, MMed (Obstetrics & Gynecology) - University of Nairobi",
        location: "MP Shah Hospital, Parklands",
        about: "Dr. Grace Muthoni is a highly experienced gynecologist offering comprehensive women's health services. She has delivered over 2000 babies and specializes in high-risk pregnancies.",
        fee: 6000,
        availability: "Available",
        rating: 4.9,
        patients: "4500+",
        success: "98%",
        imageUrl: "https://i.pravatar.cc/300?u=grace.muthoni@medicare.co.ke",
    },
    {
        name: "Dr. James Kipchoge",
        email: "james.kipchoge@medicare.co.ke",
        password: "Doctor@123",
        specialization: "Orthopedic Surgeon",
        experience: "10 years",
        qualifications: "MBChB, MMed (Orthopedics) - Moi University",
        location: "Nairobi West Hospital, Nairobi West",
        about: "Dr. James Kipchoge is an orthopedic surgeon specializing in sports injuries and joint replacements. He has treated several Kenyan athletes including marathon runners.",
        fee: 7000,
        availability: "Available",
        rating: 4.7,
        patients: "2000+",
        success: "96%",
        imageUrl: "https://i.pravatar.cc/300?u=james.kipchoge@medicare.co.ke",
    },
    {
        name: "Dr. Fatuma Hassan",
        email: "fatuma.hassan@medicare.co.ke",
        password: "Doctor@123",
        specialization: "Dermatologist",
        experience: "7 years",
        qualifications: "MBChB, MMed (Dermatology) - University of Nairobi",
        location: "The Nairobi Clinic, Hurlingham",
        about: "Dr. Fatuma Hassan is a dermatologist specializing in skin conditions common in East Africa including hyperpigmentation, acne, and eczema. She offers both medical and cosmetic dermatology.",
        fee: 4000,
        availability: "Available",
        rating: 4.6,
        patients: "2500+",
        success: "95%",
        imageUrl: "https://i.pravatar.cc/300?u=fatuma.hassan@medicare.co.ke",
    },
    {
        name: "Dr. Peter Kamau",
        email: "peter.kamau@medicare.co.ke",
        password: "Doctor@123",
        specialization: "General Physician",
        experience: "5 years",
        qualifications: "MBChB - Kenyatta University",
        location: "Karen Hospital, Karen",
        about: "Dr. Peter Kamau is a general physician providing comprehensive primary healthcare. He focuses on preventive medicine and chronic disease management.",
        fee: 2500,
        availability: "Available",
        rating: 4.5,
        patients: "1800+",
        success: "94%",
        imageUrl: "https://i.pravatar.cc/300?u=peter.kamau@medicare.co.ke",
    },
    {
        name: "Dr. Esther Achieng",
        email: "esther.achieng@medicare.co.ke",
        password: "Doctor@123",
        specialization: "Ophthalmologist",
        experience: "9 years",
        qualifications: "MBChB, MMed (Ophthalmology) - University of Nairobi",
        location: "Kikuyu Eye Unit, Kikuyu",
        about: "Dr. Esther Achieng is an ophthalmologist specializing in cataract surgery and glaucoma treatment. She has performed over 1000 successful eye surgeries.",
        fee: 4500,
        availability: "Available",
        rating: 4.8,
        patients: "3500+",
        success: "98%",
        imageUrl: "https://i.pravatar.cc/300?u=esther.achieng@medicare.co.ke",
    },
    {
        name: "Dr. Samuel Ndung'u",
        email: "samuel.ndungu@medicare.co.ke",
        password: "Doctor@123",
        specialization: "Neurologist",
        experience: "14 years",
        qualifications: "MBChB, MMed (Neurology) - University of Nairobi",
        location: "Nairobi Hospital, Upper Hill",
        about: "Dr. Samuel Ndung'u is a neurologist with expertise in epilepsy, stroke, and neurodegenerative diseases. He is a member of the African Academy of Neurology.",
        fee: 8000,
        availability: "Available",
        rating: 4.9,
        patients: "2800+",
        success: "97%",
        imageUrl: "https://i.pravatar.cc/300?u=samuel.ndungu@medicare.co.ke",
    },
    {
        name: "Dr. Mary Wambua",
        email: "mary.wambua@medicare.co.ke",
        password: "Doctor@123",
        specialization: "Psychiatrist",
        experience: "11 years",
        qualifications: "MBChB, MMed (Psychiatry) - University of Nairobi",
        location: "Mathare Hospital, Mathare",
        about: "Dr. Mary Wambua is a psychiatrist dedicated to mental health care in Kenya. She specializes in depression, anxiety, and trauma-related disorders.",
        fee: 5500,
        availability: "Unavailable",
        rating: 4.7,
        patients: "2200+",
        success: "95%",
        imageUrl: "https://i.pravatar.cc/300?u=mary.wambua@medicare.co.ke",
    },
    {
        name: "Dr. Ali Mohamed",
        email: "ali.mohamed@medicare.co.ke",
        password: "Doctor@123",
        specialization: "Urologist",
        experience: "6 years",
        qualifications: "MBChB, MMed (Urology) - Aga Khan University",
        location: "Aga Khan Hospital, Parklands",
        about: "Dr. Ali Mohamed is a urologist specializing in kidney stones, prostate conditions, and urinary tract disorders. He uses minimally invasive techniques for faster recovery.",
        fee: 6500,
        availability: "Available",
        rating: 4.6,
        patients: "1500+",
        success: "96%",
        imageUrl: "https://i.pravatar.cc/300?u=ali.mohamed@medicare.co.ke",
    },
    {
        name: "Dr. Caroline Njeri",
        email: "caroline.njeri@medicare.co.ke",
        password: "Doctor@123",
        specialization: "Endocrinologist",
        experience: "13 years",
        qualifications: "MBChB, MMed (Endocrinology) - University of Nairobi",
        location: "MP Shah Hospital, Parklands",
        about: "Dr. Caroline Njeri specializes in diabetes, thyroid disorders, and hormonal imbalances. She runs a diabetes clinic serving over 500 patients monthly.",
        fee: 5500,
        availability: "Available",
        rating: 4.8,
        patients: "4000+",
        success: "97%",
        imageUrl: "https://i.pravatar.cc/300?u=caroline.njeri@medicare.co.ke",
    },
    {
        name: "Dr. David Omondi",
        email: "david.omondi@medicare.co.ke",
        password: "Doctor@123",
        specialization: "Gastroenterologist",
        experience: "9 years",
        qualifications: "MBChB, MMed (Gastroenterology) - Moi University",
        location: "Nairobi Hospital, Upper Hill",
        about: "Dr. David Omondi specializes in digestive health including ulcers, liver disease, and colorectal conditions. He performs endoscopic procedures and colonoscopies.",
        fee: 6000,
        availability: "Available",
        rating: 4.7,
        patients: "2600+",
        success: "96%",
        imageUrl: "https://i.pravatar.cc/300?u=david.omondi@medicare.co.ke",
    },
];

// Services data
const servicesData = [
    {
        name: "Full Blood Count (FBC)",
        price: 1500,
        about: "A comprehensive blood test that measures different components of blood including red blood cells, white blood cells, and platelets. Essential for diagnosing infections, anaemia, and other conditions.",
        instructions: [
            "Fast for at least 8 hours before the test",
            "Drink plenty of water",
            "Avoid strenuous exercise 24 hours before",
            "Inform us of any medications you are taking",
        ],
        imageUrl: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=400&q=80",
        dates: [],
        slots: {},
    },
    {
        name: "Blood Sugar Test",
        price: 800,
        about: "Measures the level of glucose in your blood. Used to diagnose and monitor diabetes and prediabetes. Available as fasting, random, or HbA1c test.",
        instructions: [
            "Fast for 8-10 hours for fasting blood sugar",
            "No fasting required for random blood sugar",
            "Continue taking your regular medications unless advised otherwise",
            "Arrive early in the morning for best results",
        ],
        imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&q=80",
        dates: [],
        slots: {},
    },
    {
        name: "Chest X-Ray",
        price: 2500,
        about: "A diagnostic imaging test that produces images of the chest including the lungs, heart, and bones. Used to diagnose pneumonia, tuberculosis, heart conditions, and more.",
        instructions: [
            "Remove all jewellery and metal objects",
            "Wear comfortable loose clothing",
            "Inform us if you are pregnant or may be pregnant",
            "No special preparation required",
        ],
        imageUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80",
        dates: [],
        slots: {},
    },
    {
        name: "Ultrasound Scan",
        price: 3500,
        about: "A non-invasive imaging test using sound waves to create images of internal organs. Used for abdominal, pelvic, obstetric, and thyroid assessments.",
        instructions: [
            "Drink 4-6 glasses of water 1 hour before abdominal scan",
            "Do not urinate before the scan",
            "Fast for 6 hours for abdominal ultrasound",
            "Wear comfortable two-piece clothing",
        ],
        imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&q=80",
        dates: [],
        slots: {},
    },
    {
        name: "General Health Checkup",
        price: 5000,
        about: "A comprehensive health screening package covering vital signs, blood tests, urine analysis, and a consultation with a general physician. Ideal for annual health monitoring.",
        instructions: [
            "Fast for 10-12 hours before the checkup",
            "Bring your previous medical records if available",
            "Wear comfortable clothing",
            "Allocate 2-3 hours for the full checkup",
        ],
        imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80",
        dates: [],
        slots: {},
    },
    {
        name: "Dental Checkup & Cleaning",
        price: 2000,
        about: "A thorough dental examination and professional cleaning to maintain oral health. Includes cavity check, gum assessment, and scaling and polishing.",
        instructions: [
            "Brush and floss your teeth before the appointment",
            "Inform us of any dental pain or sensitivity",
            "Avoid eating 2 hours before the appointment",
            "Bring your previous dental records if available",
        ],
        imageUrl: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&q=80",
        dates: [],
        slots: {},
    },
    {
        name: "Eye Examination",
        price: 2500,
        about: "A comprehensive eye test to assess vision and check for eye conditions such as glaucoma, cataracts, and diabetic retinopathy. Includes prescription for glasses if needed.",
        instructions: [
            "Remove contact lenses 24 hours before the exam",
            "Bring your current glasses or contact lens prescription",
            "Avoid driving after the exam if pupils are dilated",
            "Inform us of any family history of eye conditions",
        ],
        imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&q=80",
        dates: [],
        slots: {},
    },
    {
        name: "Physiotherapy Session",
        price: 3000,
        about: "A professional physiotherapy session for rehabilitation, pain management, and injury recovery. Covers musculoskeletal, neurological, and sports injuries.",
        instructions: [
            "Wear comfortable loose-fitting clothing",
            "Bring any relevant X-rays or MRI scans",
            "Inform the therapist of all areas of pain",
            "Avoid heavy meals 1 hour before the session",
        ],
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
        dates: [],
        slots: {},
    },
    {
        name: "Malaria Test (RDT & Microscopy)",
        price: 600,
        about: "A rapid diagnostic test and microscopy examination to detect malaria parasites in the blood. Results available within 30 minutes.",
        instructions: [
            "No special preparation required",
            "Inform us of any antimalarial medications taken recently",
            "Test can be done at any time of day",
            "Bring your NHIF card if applicable",
        ],
        imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80",
        dates: [],
        slots: {},
    },
    {
        name: "HIV Testing & Counselling",
        price: 500,
        about: "Confidential HIV testing with pre and post-test counselling. Includes rapid test with results in 15 minutes and linkage to care if needed.",
        instructions: [
            "No special preparation required",
            "Testing is completely confidential",
            "Counselling is provided before and after the test",
            "Results are ready in 15-20 minutes",
        ],
        imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
        dates: [],
        slots: {},
    },
];

// Generate service slots for next 14 days
function generateServiceSlots() {
    const slots = {};
    const dates = [];
    const timeSlots = [
        "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
        "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
    ];

    for (let i = 1; i <= 14; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        if (date.getDay() === 0) continue;
        const dateStr = date.toISOString().split("T")[0];
        dates.push(dateStr);
        const shuffled = [...timeSlots].sort(() => Math.random() - 0.5);
        slots[dateStr] = shuffled.slice(0, 5);
    }

    return { dates, slots };
}

async function seed() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB:", mongoose.connection.name);

        // Clear existing data
        await Doctor.deleteMany({});
        await Service.deleteMany({});
        console.log("🗑️ Cleared existing doctors and services");

        // Seed doctors
        console.log("\n👨‍⚕️ Seeding doctors...");
        for (const doctorData of doctorsData) {
            try {
                // Upload image to Cloudinary
                const publicId = doctorData.name
                    .toLowerCase()
                    .replace(/\s+/g, "_")
                    .replace(/[^a-z0-9_]/g, "");

                console.log(`📤 Uploading image for ${doctorData.name}...`);
                const { url, publicId: uploadedPublicId } = await uploadFromUrl(
                    doctorData.imageUrl,
                    publicId,
                    "medicare/doctors",
                );

                // Create doctor
                const doctor = new Doctor({
                    ...doctorData,
                    imageUrl: url,
                    imagePublicId: uploadedPublicId,
                    schedule: generateSchedule(),
                });

                await doctor.save();
                console.log(`✅ Doctor saved: ${doctorData.name}`);
            } catch (err) {
                console.error(`❌ Failed to save ${doctorData.name}:`, err.message);
            }
        }

        // Seed services
        console.log("\n🏥 Seeding services...");
        for (const serviceData of servicesData) {
            try {
                // Upload image to Cloudinary
                const publicId = serviceData.name
                    .toLowerCase()
                    .replace(/\s+/g, "_")
                    .replace(/[^a-z0-9_]/g, "");

                console.log(`📤 Uploading image for ${serviceData.name}...`);
                const { url, publicId: uploadedPublicId } = await uploadFromUrl(
                    serviceData.imageUrl,
                    publicId,
                    "medicare/services",
                );

                // Generate slots
                const { dates, slots } = generateServiceSlots();

                // Create service
                const ServiceModel = mongoose.model("Service");
                const service = new ServiceModel({
                    ...serviceData,
                    imageUrl: url,
                    imagePublicId: uploadedPublicId,
                    dates,
                    slots,
                });

                await service.save();
                console.log(`✅ Service saved: ${serviceData.name}`);
            } catch (err) {
                console.error(`❌ Failed to save ${serviceData.name}:`, err.message);
            }
        }

        console.log("\n🎉 Seeding complete!");
        console.log(`✅ ${doctorsData.length} doctors seeded`);
        console.log(`✅ ${servicesData.length} services seeded`);

        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding failed:", err.message);
        process.exit(1);
    }
}

seed();