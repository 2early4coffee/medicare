import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

// Kenyan patient names
const kenyanPatients = [
  {
    name: "Wanjiru Kamau",
    mobile: "0712345678",
    age: 32,
    gender: "Female",
    email: "wanjiru.kamau@gmail.com",
  },
  {
    name: "Otieno Odhiambo",
    mobile: "0723456789",
    age: 45,
    gender: "Male",
    email: "otieno.odhiambo@gmail.com",
  },
  {
    name: "Aisha Mohamed",
    mobile: "0734567890",
    age: 28,
    gender: "Female",
    email: "aisha.mohamed@gmail.com",
  },
  {
    name: "Kipchoge Ruto",
    mobile: "0745678901",
    age: 55,
    gender: "Male",
    email: "kipchoge.ruto@gmail.com",
  },
  {
    name: "Njeri Mwangi",
    mobile: "0756789012",
    age: 38,
    gender: "Female",
    email: "njeri.mwangi@gmail.com",
  },
  {
    name: "Hassan Abdi",
    mobile: "0767890123",
    age: 42,
    gender: "Male",
    email: "hassan.abdi@gmail.com",
  },
  {
    name: "Chebet Korir",
    mobile: "0778901234",
    age: 25,
    gender: "Female",
    email: "chebet.korir@gmail.com",
  },
  {
    name: "Mwenda Kirimi",
    mobile: "0789012345",
    age: 60,
    gender: "Male",
    email: "mwenda.kirimi@gmail.com",
  },
  {
    name: "Zawadi Omondi",
    mobile: "0790123456",
    age: 33,
    gender: "Female",
    email: "zawadi.omondi@gmail.com",
  },
  {
    name: "Baraka Mutua",
    mobile: "0701234567",
    age: 48,
    gender: "Male",
    email: "baraka.mutua@gmail.com",
  },
  {
    name: "Amina Yusuf",
    mobile: "0712456789",
    age: 29,
    gender: "Female",
    email: "amina.yusuf@gmail.com",
  },
  {
    name: "Kariuki Ngugi",
    mobile: "0723567890",
    age: 52,
    gender: "Male",
    email: "kariuki.ngugi@gmail.com",
  },
  {
    name: "Nafula Wekesa",
    mobile: "0734678901",
    age: 36,
    gender: "Female",
    email: "nafula.wekesa@gmail.com",
  },
  {
    name: "Ochieng Siaya",
    mobile: "0745789012",
    age: 41,
    gender: "Male",
    email: "ochieng.siaya@gmail.com",
  },
  {
    name: "Zipporah Njeru",
    mobile: "0756890123",
    age: 27,
    gender: "Female",
    email: "zipporah.njeru@gmail.com",
  },
  {
    name: "Abdullahi Omar",
    mobile: "0767901234",
    age: 58,
    gender: "Male",
    email: "abdullahi.omar@gmail.com",
  },
  {
    name: "Wairimu Gicheru",
    mobile: "0778012345",
    age: 44,
    gender: "Female",
    email: "wairimu.gicheru@gmail.com",
  },
  {
    name: "Maina Githinji",
    mobile: "0789123456",
    age: 39,
    gender: "Male",
    email: "maina.githinji@gmail.com",
  },
  {
    name: "Asha Farah",
    mobile: "0790234567",
    age: 31,
    gender: "Female",
    email: "asha.farah@gmail.com",
  },
  {
    name: "Kamotho Njoroge",
    mobile: "0701345678",
    age: 50,
    gender: "Male",
    email: "kamotho.njoroge@gmail.com",
  },
  {
    name: "Pauline Aoko",
    mobile: "0712567890",
    age: 34,
    gender: "Female",
    email: "pauline.aoko@gmail.com",
  },
  {
    name: "Festus Mutuku",
    mobile: "0723678901",
    age: 47,
    gender: "Male",
    email: "festus.mutuku@gmail.com",
  },
  {
    name: "Rehema Juma",
    mobile: "0734789012",
    age: 26,
    gender: "Female",
    email: "rehema.juma@gmail.com",
  },
  {
    name: "Simiyu Wafula",
    mobile: "0745890123",
    age: 53,
    gender: "Male",
    email: "simiyu.wafula@gmail.com",
  },
  {
    name: "Lydiah Mumo",
    mobile: "0756901234",
    age: 37,
    gender: "Female",
    email: "lydiah.mumo@gmail.com",
  },
  {
    name: "Omondi Adhiambo",
    mobile: "0767012345",
    age: 43,
    gender: "Male",
    email: "omondi.adhiambo@gmail.com",
  },
  {
    name: "Tabitha Wanjiku",
    mobile: "0778123456",
    age: 30,
    gender: "Female",
    email: "tabitha.wanjiku@gmail.com",
  },
  {
    name: "Njuguna Kamau",
    mobile: "0789234567",
    age: 56,
    gender: "Male",
    email: "njuguna.kamau@gmail.com",
  },
  {
    name: "Halima Abdi",
    mobile: "0790345678",
    age: 24,
    gender: "Female",
    email: "halima.abdi@gmail.com",
  },
  {
    name: "Kiptoo Sang",
    mobile: "0701456789",
    age: 49,
    gender: "Male",
    email: "kiptoo.sang@gmail.com",
  },
];

const statuses = [
  "Pending",
  "Pending",
  "Pending",
  "Confirmed",
  "Confirmed",
  "Completed",
  "Completed",
  "Completed",
  "Completed",
  "Canceled",
];

const timeSlots = [
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate(daysBack = 30, daysForward = 14) {
  const date = new Date();
  const offset =
    Math.floor(Math.random() * (daysBack + daysForward)) - daysBack;
  date.setDate(date.getDate() + offset);
  return date.toISOString().split("T")[0];
}

function getPaymentForStatus(status, fee) {
  if (status === "Completed") {
    return {
      method: Math.random() > 0.5 ? "Online" : "Cash",
      status: "Paid",
      amount: fee,
      paidAt: new Date(),
    };
  }
  if (status === "Canceled") {
    return {
      method: "Online",
      status: "Refunded",
      amount: fee,
      paidAt: null,
    };
  }
  return {
    method: Math.random() > 0.5 ? "Online" : "Cash",
    status: "Pending",
    amount: fee,
    paidAt: null,
  };
}

async function seedAppointments() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB:", mongoose.connection.name);

    // Clear existing appointments
    await Appointment.deleteMany({});
    console.log("🗑️ Cleared existing appointments");

    // Fetch all doctors
    const doctors = await Doctor.find({}).lean();
    if (doctors.length === 0) {
      console.error("❌ No doctors found. Run seed.js first.");
      process.exit(1);
    }

    console.log(`\n📅 Seeding appointments for ${doctors.length} doctors...`);

    let totalAppointments = 0;

    for (const doctor of doctors) {
      // 5-10 appointments per doctor
      const count = Math.floor(Math.random() * 6) + 5;

      for (let i = 0; i < count; i++) {
        const patient = getRandomItem(kenyanPatients);
        const status = getRandomItem(statuses);
        const date = getRandomDate(30, 14);
        const time = getRandomItem(timeSlots);
        const payment = getPaymentForStatus(status, doctor.fee);

        const appointment = new Appointment({
          owner: `seed_user_${Math.floor(Math.random() * 30) + 1}`, // ✅ fake clerk user id
          createdBy: null,
          doctorId: doctor._id,
          doctorName: doctor.name,
          doctorImage: {
            url: doctor.imageUrl || "", // ✅ object not string
            publicId: doctor.imagePublicId || "",
          },
          speciality: doctor.specialization, // ✅ speciality not specialization
          patientName: patient.name,
          mobile: patient.mobile,
          age: patient.age,
          gender: patient.gender,
          date,
          time,
          fees: doctor.fee,
          status,
          payment,
        });

        await appointment.save();
        totalAppointments++;
      }

      console.log(`✅ Appointments seeded for ${doctor.name}`);
    }

    console.log(`\n🎉 Appointments seeding complete!`);
    console.log(
      `✅ ${totalAppointments} appointments seeded across ${doctors.length} doctors`,
    );

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seedAppointments();
