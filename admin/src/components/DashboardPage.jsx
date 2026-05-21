import React, { useState } from 'react'
import { dashboardStyles as s } from '../assets/dummyStyles';

const API_BASE = 'http://localhost:4000/';
const PATIENT_COUNT_API = '${API_BASE}/api/appointments/patients/count';


//HELPER FUNCTION
// it will return a finite number
const safeNumber = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
};

//details of doc
function normalizeDoctor(doc) {
    const id = doc._id || doc.id || String(Math.random()).slice(2);
    const name =
    doc.name ||
    doc.fullName ||
    `${doc.firstName || ""} ${doc.lastName || ""}`.trim() ||
    "Unknown";
    const specialization =
    doc.specialization ||
    doc.speciality ||
    (Array.isArray(doc.specializations)
        ? doc.specializations.join(", ")
        : "") ||
    "General";
    const fee = safeNumber(
    doc.fee ?? doc.fees ?? doc.consultationFee ?? doc.consultation_fee ?? 0,
    0
    );
    const image =
    doc.imageUrl ||
    doc.image ||
    doc.avatar ||
    `https://i.pravatar.cc/150?u=${id}`;

    const appointments = {
    total:
        doc.appointments?.total ??
        doc.totalAppointments ??
        doc.appointmentsTotal ??
        0,
    completed:
        doc.appointments?.completed ??
        doc.completedAppointments ??
        doc.appointmentsCompleted ??
        0,
    canceled:
        doc.appointments?.canceled ??
        doc.canceledAppointments ??
        doc.appointmentsCanceled ??
        0,
    };

    let earnings = null;
    if (doc.earnings !== undefined && doc.earnings !== null)
    earnings = safeNumber(doc.earnings, 0);
    else if (doc.revenue !== undefined && doc.revenue !== null)
    earnings = safeNumber(doc.revenue, 0);
    else if (appointments.completed && fee)
    earnings = fee * safeNumber(appointments.completed, 0);
    else earnings = 0;

    return {
    id,
    name,
    specialization,
    fee,
    image,
    appointments,
    earnings,
    raw: doc,
    };
}

const DashboardPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] =useState(null);

    // new patient
    const [patientCount, setPatientCount] = useState(null);
    const [patientCountLoading, setPatientCountLoading] = useState(false);

    const [query, setQuery] = useState("");
    const [showAll, setShowAll] = useState(false);

    // to load doctors from the server

        useEffect(() => {
    let mounted = true;
    async function loadDoctors() {
        setLoading(true);
        setError(null);
        try {
        const url = `${API_BASE}/api/doctors?limit=200`;
        const res = await fetch(url);
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(
            body?.message || `Failed to fetch doctors (${res.status})`
            );
        }
        const body = await res.json();
        let list = [];
        if (Array.isArray(body)) list = body;
        else if (Array.isArray(body.doctors)) list = body.doctors;
        else if (Array.isArray(body.data)) list = body.data;
        else if (Array.isArray(body.items)) list = body.items;
        else {
            const firstArray = Object.values(body).find((v) => Array.isArray(v));
            if (firstArray) list = firstArray;
        }
        const normalized = list.map((d) => normalizeDoctor(d));
        if (mounted) setDoctors(normalized);
        } catch (err) {
        console.error("Failed to load doctors:", err);
        if (mounted) {
            setError(err.message || "Failed to load doctors");
            setDoctors([]);
        }
        } finally {
        if (mounted) setLoading(false);
        }
    }
    loadDoctors();
    return () => {
        mounted = false;
    };
    }, []);

    useEffect(() => {
    let mounted = true;
    async function loadPatientCount() {
        setPatientCountLoading(true);
        try {
        const res = await fetch(PATIENT_COUNT_API);
        if (!res.ok) {
            console.warn("Patient count fetch failed:", res.status);
            if (mounted) setPatientCount(0);
            return;
        }

        const body = await res.json().catch(() => ({}));
        const count = Number(
            body?.count ?? body?.totalUsers ?? body?.data ?? 0
        );
        if (mounted) setPatientCount(isNaN(count) ? 0 : count);
        } catch (err) {
        console.error("Failed to fetch patient count:", err);
        if (mounted) setPatientCount(0);
        } finally {
        if (mounted) setPatientCountLoading(false);
        }
    }
    loadPatientCount();
    return () => {
        mounted = false;
    };
    }, []);

// derived totals
    const totals = useMemo(() => {
    const totalDoctors = doctors.length;
    const totalAppointments = doctors.reduce(
        (s, d) => s + safeNumber(d.appointments?.total, 0),
        0
    );
    const totalEarnings = doctors.reduce(
        (s, d) => s + safeNumber(d.earnings, 0),
        0
    );
    const completed = doctors.reduce(
        (s, d) => s + safeNumber(d.appointments?.completed, 0),
        0
    );
    const canceled = doctors.reduce(
        (s, d) => s + safeNumber(d.appointments?.canceled, 0),
        0
    );
    const totalLoginPatients =
        doctors.reduce((s, d) => s + (d.raw?.loginPatientsCount ?? 0), 0) || 0;
    return {
        totalDoctors,
        totalAppointments,
        totalEarnings,
        completed,
        canceled,
        totalLoginPatients,
    };
    }, [doctors]);

    //to filter the doctors
    const filteredDoctors = useMemo(() => {
    if (!query) return doctors;
    const q = query.trim().toLowerCase();
    const qNum = Number(q);
    return doctors.filter((d) => {
        if (d.name.toLowerCase().includes(q)) return true;
        if ((d.specialization || "").toLowerCase().includes(q)) return true;
        if (d.fee.toString().includes(q)) return true;
        if (!Number.isNaN(qNum) && d.fee <= qNum) return true;
        return false;
    });
    }, [doctors, query]);

    const INITIAL_COUNT = 8;
    const visibleDoctors = showAll
    ? filteredDoctors
    : filteredDoctors.slice(0, INITIAL_COUNT);

    return (
        <div className= {s.pageContainer}>
            <div className={s.maxWidthContainer}> 
                <div className={s.headerContainer}>
                    <div >
                        <h1 className ={s.headerTitle}> DASHBOARD </h1>
                        <p className={s.headerSubtitle}>
                        Overview of doctors & appointments
                        </p>
                    </div>
                </div>

                {/* stats section*/}
                <div className={s.statsGrid}>
                    <StatCard icon = {<Users className = "w-6 h-6"/>}
                    label = "Total Doctors" value ={totals.totalDoctor}/>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage
