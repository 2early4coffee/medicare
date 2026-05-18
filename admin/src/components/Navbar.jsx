import React from 'react'
import {navbarStyles as ns} from '../assets/dummyStyles';
import logoImg from '../assets/logo.png';
import { Link } from 'react-router-dom';


const Navbar = () => {
    const [open, setOpen] = React.useState(false);
    const NavInnerRef = useRef(null);
    const indicatorRef = useRef(null);
    const location = useLocation();
    const  navigate = useNavigate();

    return (
        <div>
        <header className={ns.header}>
            <nav className={ns.navContainer}>
                <div className={ns.flexContainer}>
                    <div className={ns.logoContainer}>
                    <img src={logoImg} alt="Logo" className={ns.logoImage}/>


                    <Link to='/'>
                    <div className={ns.logoLink}> MediCare</div>
                    <div className={ns.logoSubtext}>Healthcare Solutions </div>
                    </Link>
                </div>
                {/* centre navigation */}
                <div className={ns.centerNavContainer}>
                    <div className= {ns.glowEffect}>
                    <div className={ns.centerNavInner}>
                        <div className={ns.centerNavItem}>
                        <div ref = {navInnerRef} tabIndex={0} className={ns.centerNavScrollContainer} style={{
                            WebkitOverflowScrolling: "touch"

                            
                        }}>
                    <CenterNavItem
                        to="/h"
                        label="Dashboard"
                        icon={<Home size={16} />}
                    />
                    <CenterNavItem
                        to="/add"
                        label="Add Doctor"
                        icon={<UserPlus size={16} />}
                    />
                    <CenterNavItem
                        to="/list"
                        label="List Doctors"
                        icon={<Users size={16} />}
                    />
                    <CenterNavItem
                        to="/appointments"
                        label="Appointments"
                        icon={<Calendar size={16} />}
                    />
                    <CenterNavItem
                        to="/service-dashboard"
                        label="Service Dashboard"
                        icon={<Grid size={16} />}
                    />
                    <CenterNavItem
                        to="/add-service"
                        label="Add Service"
                        icon={<PlusSquare size={16} />}
                    />
                    <CenterNavItem
                        to="/list-service"
                        label="List Services"
                        icon={<List size={16} />}
                    />
                    <CenterNavItem
                        to="/service-appointments"
                        label="Service Appointments"
                        icon={<Calendar size={16} />}
                    />

                        </div>
                        </div>

                    </div>
                    </div>

                </div>
                </div>
            </nav>
            </header>
        </div>
    )
}

export default Navbar
