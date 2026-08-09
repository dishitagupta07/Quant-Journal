import "./TopNavbar.css"
import {MdMenu,MdCalendarToday,MdNotificationsNone,MdKeyboardArrowDown,MdLogout} from "react-icons/md";
import { useNavigate } from "react-router-dom";
function TopNavbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };
    return (
        <div className="top-navbar">
            <div className="navbar-left"><MdMenu /></div>
            <div className="navbar-right">
                <button className="date-picker">
                    <MdCalendarToday />
                    <span>July 12 – July 18, 2026</span>
                    <MdKeyboardArrowDown />
                </button>

                <button className="bell-btn">
                    <MdNotificationsNone />
                    <span className="notification-count">3</span>
                </button>

                <button className="logout-btn" onClick={handleLogout}>
    <MdLogout />
    Logout
</button>
            </div>

        </div>

    )
}
export default TopNavbar


