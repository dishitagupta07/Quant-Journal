import "./Sidebar.css"
import { MdDashboard, MdTrendingUp, MdAnalytics, MdCalendarMonth, MdSettings } from "react-icons/md"
import { useNavigate } from "react-router-dom"

function Sidebar() {

    const navigate = useNavigate()

    return (
        <div className="sidebar">

            <div className="logo">
                <h2>📈 Quant Journal</h2>
                <p>Trade • Analyze • Improve</p>
            </div>

            <hr className="sidebar-divider" />

            <nav className="sidebar-menu">

                <div
                    className="menu-item"
                    onClick={() => navigate("/dashboard")}
                >
                    <MdDashboard />
                    <span>Dashboard</span>
                </div>


                <div
                    className="menu-item"
                    onClick={() => navigate("/trades")}
                >
                    <MdTrendingUp />
                    <span>Trades</span>
                </div>


                <div className="menu-item"
                    onClick={()=>navigate("/analytics")}
                >
                    <MdAnalytics />
                    <span>Analytics</span>
                </div>


                <div className="menu-item"
                    onClick={()=>navigate("/calendar")}
                >
                    <MdCalendarMonth />
                    <span>Calendar</span>
                </div>


                <div className="menu-item"
                    onClick={()=>navigate("/accountsettings")}
                >
                    <MdSettings />
                    <span>Account & Settings</span>
                </div>

            </nav>
            <div className="sidebar-profile">
                <div className="profile-avatar">
                    D
                </div>

                <div className="profile-name">
                    Dishita
                </div>

            </div>

        </div>
    )
}

export default Sidebar