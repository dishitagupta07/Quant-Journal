import "./Dashboard.css"

import Sidebar from "../components/Sidebar"
import TopNavbar from "../components/TopNavbar"

import {
    MdShowChart,
    MdEmojiEvents,
    MdReceiptLong,
    MdBalance,
    MdNorthEast,
    MdSouthEast,
    MdMoreVert,
} from "react-icons/md"

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
} from "recharts"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const COLORS = ["#22c55e", "#ef4444", "#facc15"]

function Dashboard() {
    const [stats, setStats] = useState({})
    const [performanceData, setPerformanceData] = useState([])
    const [equityData, setEquityData] = useState([])
    const [recentTrades, setRecentTrades] = useState([])
    const [timeFilter, setTimeFilter] = useState("THIS_MONTH")

    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token")

        if (!token) {
            navigate("/login")
            return
        }

        const getProfile = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/users/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    console.log("Profile fetch failed")
                    return
                }

                const data = await response.json()
                console.log("PROFILE DATA:", data)
            } catch (error) {
                console.error("Error fetching profile:", error)
            }
        }

        const fetchStats = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/trades/stats", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    console.log("Stats fetch failed")
                    return
                }

                const data = await response.json()
                console.log("STATS DATA:", data)

                setStats(data)
                setPerformanceData(data.performanceData || [])
                setEquityData(data.equityData || [])
                setRecentTrades(data.recentTrades || [])
            } catch (error) {
                console.error("Error fetching stats:", error)
            }
        }

        getProfile()
        fetchStats()
    }, [navigate])

    const filteredEquityData =
        timeFilter === "THIS_MONTH"
            ? equityData.filter((item) => {
                const today = new Date()
                const date = new Date(item.day)
                return (
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear()
                )
            })
            : equityData

    return (
        <div className="dashboard-container">
            <Sidebar />

            <div className="main-content">
                <TopNavbar />

                <div className="dashboard-header">
                    <h1>Good Evening! 👋</h1>
                    <p>Welcome back! Here's your trading performance today.</p>
                </div>

                {/* Stats Section */}
                <div className="stats-section">
                    <div className="stat-card">
                        <div className="card-header">
                            <h3>Total P&L</h3>
                            <MdShowChart />
                        </div>
                        <h2>
                            {stats.totalProfit >= 0
                                ? `₹${stats.totalProfit || 0}`
                                : `-₹${Math.abs(stats.totalProfit)}`}
                        </h2>
                        <p>
                            {stats.lastWeekProfit >= 0
                                ? `+₹${stats.lastWeekProfit || 0} this week`
                                : `-₹${Math.abs(stats.lastWeekProfit || 0)} this week`}
                        </p>
                    </div>

                    <div className="stat-card">
                        <div className="card-header">
                            <h3>Win Rate</h3>
                            <MdEmojiEvents />
                        </div>
                        <h2>{stats.winRate || 0}%</h2>
                        <p>Your trading performance</p>
                    </div>

                    <div className="stat-card">
                        <div className="card-header">
                            <h3>Total Trades</h3>
                            <MdReceiptLong />
                        </div>
                        <h2>{stats.totalTrades || 0}</h2>
                        <p>Your trading performance</p>
                    </div>

                    <div className="stat-card">

                        <div className="card-header">
                            <h3>Average RR</h3>
                            <MdBalance />
                        </div>

                        <h2>{stats.averageRR || 0}R</h2>

                        <p>Average Risk Reward</p>

                    </div>
                </div>

                {/* Charts Section */}
                <div className="charts-section">
                    <div className="chart-card">
                        <div className="chart-header">
                            <h2>Equity Curve</h2>
                            <button
                                onClick={() =>
                                    setTimeFilter((prev) =>
                                        prev === "THIS_MONTH" ? "ALL_TIME" : "THIS_MONTH"
                                    )
                                }
                            >
                                {timeFilter === "THIS_MONTH" ? "This Month ▼" : "All Trades ▼"}
                            </button>
                        </div>

                        <div className="equity-chart">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={filteredEquityData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="day"
                                        tick={{ fill: "#6b7280", fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        tick={{ fill: "#6b7280", fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#ffffff",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "12px",
                                            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#7c3aed"
                                        strokeWidth={2}
                                        fill="#7c3aed"
                                        fillOpacity={0.12}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <h2>Performance Breakdown</h2>
                        </div>

                        <div className="performance-wrapper">
                            <div className="performance-content">
                                <div className="donut-chart">
                                    {performanceData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={performanceData}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    innerRadius={55}
                                                    cornerRadius={3}
                                                    paddingAngle={1}
                                                    stroke="white"
                                                    strokeWidth={2}
                                                >
                                                    {performanceData.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={COLORS[index % COLORS.length]}
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <p>No Data</p>
                                    )}

                                    <div className="donut-center">
                                        <h2>{stats.totalTrades || 0}</h2>
                                        <p>Total Trades</p>
                                    </div>
                                </div>

                                <div className="performance-legend">
                                    <div className="legend-item">
                                        <div className="legend-left">
                                            <span className="green-dot"></span>
                                            <span>Profitable</span>
                                        </div>
                                        <strong>{performanceData[0]?.value || 0}</strong>
                                    </div>

                                    <div className="legend-item">
                                        <div className="legend-left">
                                            <span className="red-dot"></span>
                                            <span>Losing</span>
                                        </div>
                                        <strong>{performanceData[1]?.value || 0}</strong>
                                    </div>

                                    <div className="legend-item">
                                        <div className="legend-left">
                                            <span className="yellow-dot"></span>
                                            <span>Breakeven</span>
                                        </div>
                                        <strong>{performanceData[2]?.value || 0}</strong>
                                    </div>
                                </div>
                            </div>

                            <div className="performance-banner">
                                <span className="banner-icon">🏆</span>
                                <span className="banner-text">
                                    Great job! You're performing better than last week.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Trades Table */}
                <div className="recent-trades-card">
                    <div className="recent-trades-header">
                        <h2>Recent Trades</h2>
                        <button onClick={() => navigate("/trades")}>View All Trades</button>
                    </div>

                    <div className="recent-trades-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Symbol</th>
                                    <th>Direction</th>
                                    <th>Result</th>
                                    <th>P&L</th>
                                    <th>RR</th>
                                    <th>Setup</th>
                                    <th>Duration</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentTrades.length > 0 ? (
                                    recentTrades.map((trade, index) => (
                                        <tr key={trade._id || index}>
                                            <td>
                                                {trade.tradeDate
                                                    ? new Date(trade.tradeDate).toLocaleDateString()
                                                    : "-"}
                                            </td>
                                            <td>{trade.stockName}</td>
                                            <td>
                                                <span
                                                    className={`direction ${trade.type === "BUY" ? "long" : "short"
                                                        }`}
                                                >
                                                    {trade.type === "BUY" ? <MdNorthEast /> : <MdSouthEast />}
                                                    {trade.type}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className={`result-badge ${trade.profitLoss > 0
                                                            ? "win"
                                                            : trade.profitLoss < 0
                                                                ? "loss"
                                                                : "breakeven"
                                                        }`}
                                                >
                                                    {trade.profitLoss > 0
                                                        ? "Win"
                                                        : trade.profitLoss < 0
                                                            ? "Loss"
                                                            : "Breakeven"}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className={`pnl ${trade.profitLoss > 0
                                                            ? "win"
                                                            : trade.profitLoss < 0
                                                                ? "loss"
                                                                : "breakeven"
                                                        }`}
                                                >
                                                    ₹{trade.profitLoss}
                                                </span>
                                            </td>
                                            <td>-</td>
                                            <td>{trade.strategy || "-"}</td>
                                            <td>-</td>
                                            <td>
                                                <button className="more-info-btn">
                                                    <MdMoreVert />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9">No trades found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard