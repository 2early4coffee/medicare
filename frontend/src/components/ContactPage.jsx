import { useState } from 'react'
import { contactPageStyles } from '../assets/dummyStyles'
import { Mail, MapPin, MessageSquare, Phone, PhoneCall, SendHorizontal, Stethoscope, User } from 'lucide-react';

const initial = {
    name: "",
    email: "",
    phone: "",
    department: "",
    service: "",
    message: "",
};

const departments = [
    "General Physician",
    "Cardiology",
    "Orthopedics",
    "Dermatology",
    "Pediatrics",
    "Gynecology",
];

const servicesMapping = {
    "General Physician": ["General Consultation", "Adult Checkup", "Vaccination", "Health Screening"],
    Cardiology: ["ECG", "Echocardiography", "Stress Test", "Heart Consultation"],
    Orthopedics: ["Fracture Care", "Joint Pain Consultation", "Physiotherapy"],
    Dermatology: ["Skin Consultation", "Allergy Test", "Acne Treatment"],
    Pediatrics: ["Child Checkup", "Vaccination (Child)", "Growth Monitoring"],
    Gynecology: ["Antenatal Care", "Pap Smear", "Ultrasound"],
};

const genericServices = [
    "General Consultation", "ECG", "Blood Test",
    "X-Ray", "Ultrasound", "Physiotherapy", "Vaccination",
];

const ContactPage = () => {
    const [form, setForm] = useState(initial);
    const [errors, setErrors] = useState({});
    const [sent, setSent] = useState(false);

    const availableServices = form.department
        ? servicesMapping[form.department] || []
        : genericServices;

    function validate() {
        const e = {};
        if (!form.name.trim()) e.name = "Full name is required";
        if (!form.email.trim()) e.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
        if (!form.phone.trim()) e.phone = "Phone number is required";
        else if (!/^[0-9]{10}$/.test(form.phone)) e.phone = "Phone number must be exactly 10 digits";
        if (!form.department && !form.service) {
            e.department = "Please choose a department or service";
            e.service = "Please choose a department or service";
        }
        if (!form.message.trim()) e.message = "Please write a short message";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function handleChange(e) {
        const { name, value } = e.target;
        if (name === "department") {
            setForm((prev) => ({ ...prev, department: value, service: "" }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
        setErrors((prev) => ({ ...prev, [name]: undefined }));
        if (name === "department" || name === "service") {
            setErrors((prev) => {
                const copy = { ...prev };
                if (
                    (name === "department" && value) ||
                    (name === "service" && value) ||
                    form.department ||
                    form.service
                ) {
                    delete copy.department;
                    delete copy.service;
                }
                return copy;
            });
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!validate()) return;
        const text = `*Contact Request*\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nDepartment: ${form.department || "N/A"}\nService: ${form.service || "N/A"}\nMessage: ${form.message}`;
        const url = `https://wa.me/254710686970?text=${encodeURIComponent(text)}`;
        window.open(url, "_blank");
        setForm(initial);
        setErrors({});
        setSent(true);
        setTimeout(() => setSent(false), 4000);
    }

    return (
        <div className={contactPageStyles.pageContainer}>
            <div className={contactPageStyles.bgAccent1}></div>
            <div className={contactPageStyles.bgAccent2}></div>

            <div className={contactPageStyles.gridContainer}>

                {/* Left - Form */}
                <div className={contactPageStyles.formContainer}>
                    <h2 className={contactPageStyles.formTitle}>Contact Our Clinic</h2>
                    <p className={contactPageStyles.formSubtitle}>
                        Fill the form — we'll open WhatsApp so you can connect with us instantly.
                    </p>

                    <form onSubmit={handleSubmit} className={contactPageStyles.formSpace}>

                        {/* Name + Email */}
                        <div className={contactPageStyles.formGrid}>
                            <div>
                                <label className={contactPageStyles.label}>
                                    <User size={16} /> Full Name
                                </label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    className={contactPageStyles.input}
                                />
                                {errors.name && (
                                    <p className={contactPageStyles.error}>{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className={contactPageStyles.label}>
                                    <Mail size={16} /> Email
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="example@mail.com"
                                    className={contactPageStyles.input}
                                />
                                {errors.email && (
                                    <p className={contactPageStyles.error}>{errors.email}</p>
                                )}
                            </div>
                        </div>

                        {/* Phone + Department */}
                        <div className={contactPageStyles.formGrid}>
                            <div>
                                <label className={contactPageStyles.label}>
                                    <Phone size={16} /> Phone
                                </label>
                                <input
                                    name="phone"
                                    type="tel"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="0712345678"
                                    className={contactPageStyles.input}
                                    maxLength="10"
                                />
                                {errors.phone && (
                                    <p className={contactPageStyles.error}>{errors.phone}</p>
                                )}
                            </div>

                            <div>
                                <label className={contactPageStyles.label}>
                                    <MapPin size={16} /> Department
                                </label>
                                <select
                                    name="department"
                                    value={form.department}
                                    onChange={handleChange}
                                    className={contactPageStyles.input}
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                                {errors.department && (
                                    <p className={contactPageStyles.error}>{errors.department}</p>
                                )}
                            </div>
                        </div>

                        {/* Service */}
                        <div>
                            <label className={contactPageStyles.label}>
                                <Stethoscope size={16} /> Service
                            </label>
                            <select
                                name="service"
                                value={form.service}
                                onChange={handleChange}
                                className={contactPageStyles.input}
                            >
                                <option value="">Select Service (or choose Department above)</option>
                                {availableServices.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                            {errors.service && (
                                <p className={contactPageStyles.error}>{errors.service}</p>
                            )}
                        </div>

                        {/* Message */}
                        <div>
                            <label className={contactPageStyles.label}>
                                <MessageSquare size={16} /> Message
                            </label>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                placeholder="Describe your concern briefly..."
                                rows={4}
                                className={contactPageStyles.textarea}
                            />
                            {errors.message && (
                                <p className={contactPageStyles.error}>{errors.message}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <div className={contactPageStyles.buttonContainer}>
                            <button type="submit" className={contactPageStyles.button}>
                                <SendHorizontal size={18} />
                                <span>Send Via WhatsApp</span>
                            </button>
                            {sent && (
                                <p className={contactPageStyles.sentMessage}>
                                    Opening WhatsApp and clearing form...
                                </p>
                            )}
                        </div>

                    </form>
                </div>

                {/* Right - Info */}
                <div className={contactPageStyles.infoContainer}>
                    <div className={contactPageStyles.infoCard}>
                        <h3 className={contactPageStyles.infoTitle}>Visit Our Clinic</h3>
                        <p className={contactPageStyles.infoText}>Moi Avenue, Nairobi Kenya</p>
                        <p className={contactPageStyles.infoItem}>
                            <PhoneCall size={16} /> +254 710 68 69 70
                        </p>
                        <p className={contactPageStyles.infoItem}>
                            <Mail size={16} /> hello@medicare.com
                        </p>
                    </div>

                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.819160087138!2d36.81701!3d-1.28333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d664b6c4e1%3A0x8a5f3c3c3c3c3c3c!2sMoi%20Avenue%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1731769000000!5m2!1sen!2ske"
                        className={contactPageStyles.map}
                        title="Clinic Location - Moi Avenue Nairobi"
                        loading="lazy"
                        allowFullScreen
                    />

                    <div className={contactPageStyles.hoursContainer}>
                        <h4 className={contactPageStyles.hoursTitle}>Clinic Hours</h4>
                        <p className={contactPageStyles.hoursText}>Mon - Sun: 9:00 AM - 6:00 PM</p>
                    </div>
                </div>

            </div>
            <style>{contactPageStyles.animationKeyframes}</style>
        </div>
    );
};

export default ContactPage;