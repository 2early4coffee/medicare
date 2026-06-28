import { certificationStyles } from "../assets/dummyStyles";
import C3 from "../assets/C3.jpg"
import C1 from "../assets/C1.png"
import C2 from "../assets/C2.jpg"
import C4 from "../assets/C4.jpeg"
import C5 from "../assets/C5.jpg"
import C6 from "../assets/C6.png"
import C7 from "../assets/C7.png"

const Certification = () => {
    const certifications = [
        { id: 1, name: "ISO 9001", image: C1, type: "international" },
        { id: 2, name: "KENAS", image: C2, type: "government" },
        { id: 3, name: "KHPOA", image: C3, alt: "Government oversight", type: "Licensing" },
        { id: 4, name: "KMPDC", image: C4, type: "government" },
        { id: 5, name: "MoH", image: C5, alt: "Ministry og Health", type: "healthcare" },
        { id: 6, name: "SafeCare", image: C6, alt: "Internationally accredited", type: "accreditation" },
        { id: 7, name: "Digital Health Agency", image: C7, alt: "Digital Services", type: "government" }
    ];

    const duplicatedCertifications = [...certifications, ...certifications, ...certifications];

    return (
        <div className={certificationStyles.container}>

            {/* Background grid */}
            <div className={certificationStyles.backgroundGrid}>
                <div className={certificationStyles.topLine}></div>
                <div className={certificationStyles.gridContainer}>
                    <div className={certificationStyles.grid}>
                        {Array.from({ length: 144 }).map((_, i) => (
                            <div key={i} className={certificationStyles.gridCell}></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className={certificationStyles.contentWrapper}>
                <div className={certificationStyles.headingContainer}>
                    <div className={certificationStyles.headingInner}>
                        <div className={certificationStyles.leftLine}></div>
                        <div className={certificationStyles.rightLine}></div>
                        <h2 className={certificationStyles.title}>
                            <span className={certificationStyles.titleText}>
                                CERTIFIED & EXCELLENCE
                            </span>
                        </h2>
                    </div>
                    <p className={certificationStyles.subtitle}>
                        Government recognized and internationally accredited healthcare standards
                    </p>

                    <div className={certificationStyles.badgeContainer}>
                        <div className={certificationStyles.badgeDot}></div>
                        <span className={certificationStyles.badgeText}>
                            OFFICIALLY CERTIFIED
                        </span>
                    </div>
                </div>
                <div className={certificationStyles.logosContainer}>
                    <div className={certificationStyles.logosInner}>
                        <div className={certificationStyles.logosFlexContainer}>
                            <div className={certificationStyles.logosMarquee}>
                                {duplicatedCertifications.map((cert, index) => (
                                    <div key={`cert-${cert.id}-${index}`}
                                        className={certificationStyles.logoItem}>
                                        <div className="relative">
                                            <img src={cert.image} alt={cert.name}
                                                className={certificationStyles.logoIamge} />

                                        </div>
                                        <span className={certificationStyles.logoText}>
                                            {cert.name}
                                        </span>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>

                </div>
            </div>
            <style>{certificationStyles.animationStyles}</style>
        </div>
    );
};

export default Certification;