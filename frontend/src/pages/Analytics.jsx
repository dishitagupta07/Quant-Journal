import "./Analytics.css";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import {
    MdCalendarToday,
    MdKeyboardArrowDown,
    MdPsychology,
    MdPublic,
    MdNorthEast,
    MdBarChart,
    MdRefresh,
    MdTrendingUp,
    MdSouthEast
} from "react-icons/md";
import {
    Area,
    ResponsiveContainer,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Pie,
    PieChart,
    Cell,
    Bar,
    BarChart,
    LabelList
} from "recharts";
import { useState, useEffect } from "react";

const COLORS = ["#16a34a", "#dc2626", "#f59e0b"];

function Analytics() {
    const [analytics, setAnalytics] = useState(null);
    const [strategyData, setStrategyData] = useState([]);
    const [bestDaysData, setBestDaysData] = useState([]);
    const [holdingTimeData, setHoldingTimeData] = useState([]);
    const [riskRewardData, setRiskRewardData] = useState([]);
    const [monthlyPnLData, setMonthlyPnLData] = useState([]);
    const [winLossData, setWinLossData] = useState([]);
    const [equityData, setEquityData] = useState([]);
    const [topWinners, setTopWinners] = useState([]);
    const [biggestLosers, setBiggestLosers] = useState([]);
    const [dateFilter, setDateFilter] = useState("This Month");
    const [strategyFilter, setStrategyFilter] = useState("All Strategies");
    const [marketFilter, setMarketFilter] = useState("All Markets");
    const [directionFilter, setDirectionFilter] = useState("All Directions");
    const [filteredTrades, setFilteredTrades] = useState([]);

    const bestTrade = analytics?.bestTrade;
    const worstTrade = analytics?.worstTrade;

    const maxPnl = Math.max(
        ...bestDaysData.map((item) => Math.abs(item.pnl)),
        1
    );

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `http://localhost:8000/api/trades/analytics?dateFilter=${encodeURIComponent(dateFilter)}&strategyFilter=${encodeURIComponent(strategyFilter)}&marketFilter=${encodeURIComponent(marketFilter)}&directionFilter=${encodeURIComponent(directionFilter)}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                const data = await response.json();

                console.log("TOP WINNERS:", data.topWinners);
                console.log("BIGGEST LOSERS:", data.biggestLosers);

                setTopWinners(data.topWinners || []);
                setBiggestLosers(data.biggestLosers || []);
                setAnalytics(data);
                setStrategyData(data.strategyData || []);
                setBestDaysData(data.bestDaysData || []);
                setHoldingTimeData(data.holdingTimeData || []);
                setRiskRewardData(data.riskRewardData || []);
                setMonthlyPnLData(data.monthlyPnLData || []);
                setWinLossData(data.winLossData || []);
                setEquityData(data.equityData || []);
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            }
        };

        fetchAnalytics();
    }, [
        dateFilter,
        strategyFilter,
        marketFilter,
        directionFilter
    ]);

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="main-wrapper">
                <TopNavbar />

                <div className="main-content">
                    {/* Header */}
                    <div className="analytics-header">
                        <div className="analytics-header-left">
                            <div className="analytics-title">
                                <MdBarChart />
                                <h1>Analytics</h1>
                            </div>
                            <p>Deep insights into your trading performance.</p>
                        </div>
                        <button
                            className="export-btn"
                            onClick={() => {
                                window.print();
                            }}
                        >
                            Export Report
                        </button>
                    </div>

                    {/* Filters Bar */}
                    <div className="analytics-filters">
                        <div className="filter-box">
                            <label>Date Range</label>
                            <select
                                className="filter-btn"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            >
                                <option value="This Month">This Month</option>
                                <option value="This Week">This Week</option>
                                <option value="Last Month">Last Month</option>
                                <option value="This Year">This Year</option>
                                <option value="All Time">All Time</option>
                            </select>
                        </div>

                        <div className="filter-box">
                            <label>Strategy</label>
                            <select
                                className="filter-btn"
                                value={strategyFilter}
                                onChange={(e) => setStrategyFilter(e.target.value)}
                            >
                                <option value="All Strategies">All Strategies</option>
                                <option value="Price Action">Price Action</option>
                                <option value="Breakout">Breakout</option>
                                <option value="Swing">Swing</option>
                                <option value="Scalping">Scalping</option>
                                <option value="Reversal">Reversal</option>
                            </select>
                        </div>

                        <div className="filter-box">
                            <label>Market</label>
                            <select
                                className="filter-btn"
                                value={marketFilter}
                                onChange={(e) => setMarketFilter(e.target.value)}
                            >
                                <option value="All Markets">All Markets</option>
                                <option value="NSE">NSE</option>
                                <option value="BSE">BSE</option>
                                <option value="NIFTY">NIFTY</option>
                                <option value="BANKNIFTY">BANKNIFTY</option>
                            </select>
                        </div>

                        <div className="filter-box">
                            <label>Direction</label>
                            <select
                                className="filter-btn"
                                value={directionFilter}
                                onChange={(e) => setDirectionFilter(e.target.value)}
                            >
                                <option value="All Directions">All Directions</option>
                                <option value="BUY">Buy</option>
                                <option value="SELL">Sell</option>
                            </select>
                        </div>

                        <button
                            className="clear-filters-btn"
                            onClick={() => {
                                setDateFilter("This Month");
                                setStrategyFilter("All Strategies");
                                setMarketFilter("All Markets");
                                setDirectionFilter("All Directions");
                            }}
                        >
                            Clear Filters
                        </button>
                    </div>
                    <div className="analytics-summary">
                        <div className="summary-card">
                            <div className="summary-card-top">
                                <span className="summary-title">Profit factor</span>
                                <div className="summary-icon purple">
                                    <MdTrendingUp />
                                </div>
                            </div>
                            <h2>{analytics?.profitFactor || 0}</h2>
                            <p className="summary-change">
                                {analytics?.profitFactor > 2
                                    ? "Excellent"
                                    : "Needs Improvement"}
                            </p>
                        </div>

                        <div className="summary-card">
                            <div className="summary-card-top">
                                <span className="summary-title">Average Winning Trade</span>
                                <div className="summary-icon green">
                                    <MdNorthEast />
                                </div>
                            </div>
                            <h2>₹{analytics?.averageWinningTrade || 0}</h2>
                            <p className="summary-change">
                                Winning trades: {analytics?.totalTrades || 0}
                            </p>
                        </div>

                        <div className="summary-card">
                            <div className="summary-card-top">
                                <span className="summary-title">Average Losing Trade</span>
                                <div className="summary-icon red">
                                    <MdSouthEast />
                                </div>
                            </div>
                            <h2>₹{analytics?.averageLosingTrade || 0}</h2>
                            <p className="summary-change">
                                Losing trades: {analytics?.totalLoss ? "Recorded" : "None"}
                            </p>
                        </div>

                        <div className="summary-card">
                            <div className="summary-card-top">
                                <span className="summary-title">Expectancy / Trade</span>
                                <div className="summary-icon blue">
                                    <MdPsychology />
                                </div>
                            </div>
                            <h2>₹{analytics?.expectancy || 0}</h2>
                            <p className="summary-change">
                                {analytics?.expectancy > 0
                                    ? "Positive Edge"
                                    : "Negative Edge"}
                            </p>
                        </div>
                    </div>

                    <div className="analytics-row">
                        <div className="monthly-card">
                            <div className="monthly-header">
                                <h3>Monthly P&L</h3>
                                <button className="small-filter-btn">{dateFilter}
                                    <MdKeyboardArrowDown />
                                </button>
                            </div>

                            <div className="monthly-chart">

                                <ResponsiveContainer width="100%" height="100%">

                                    <AreaChart
                                        data={monthlyPnLData}
                                        margin={{
                                            top: 5,
                                            right: 0,
                                            left: -15,
                                            bottom: 0
                                        }} >

                                        <defs>
                                            <linearGradient
                                                id="pnlGradient"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#7c3aed"
                                                    stopOpacity={0.35}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#7c3aed"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>

                                        <CartesianGrid
                                            vertical={false}
                                            stroke="#eef2f7"
                                        />

                                        <XAxis
                                            dataKey="month"
                                            tickLine={false}
                                            axisLine={false}
                                            interval={0}
                                            tick={{
                                                fontSize: 11,
                                                fill: "#64748b"
                                            }}
                                        />

                                        <YAxis
                                            tickLine={false}
                                            axisLine={false}
                                            width={75}
                                            tick={{
                                                fontSize: 11,
                                                fill: "#343d49"
                                            }}
                                        />

                                        <Tooltip />

                                        <Area
                                            type="monotone"
                                            dataKey="profit"
                                            stroke="#7c3aed"
                                            strokeWidth={3}
                                            fill="url(#pnlGradient)"
                                        />

                                    </AreaChart>

                                </ResponsiveContainer>

                            </div>

                        </div>

                        {/* Win/Loss Card */}
                        <div className="distribution-card">

                            <div className="distribution-header">
                                <h3> Win / Loss Distribution</h3>
                            </div>

                            <div className="distribution-content">

                                <div className="distribution-chart">

                                    <ResponsiveContainer width="100%" height="100%">

                                        <PieChart>

                                            <Pie
                                                data={winLossData}
                                                dataKey="value"
                                                innerRadius={55}
                                                outerRadius={78}
                                                paddingAngle={4}
                                                cx="50%"
                                                cy="50%"
                                            >

                                                {winLossData.map((entry, index) => (
                                                    <Cell
                                                        key={index}
                                                        fill={COLORS[index]}
                                                    />
                                                ))}

                                            </Pie>

                                            <text
                                                x="50%"
                                                y="47%"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                className="pie-center-value">
                                                {analytics?.winRate || 0}%
                                            </text>

                                            <text
                                                x="50%"
                                                y="59%"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                className="pie-center-label">Win Rate</text>

                                            <Tooltip />

                                        </PieChart>

                                    </ResponsiveContainer>

                                </div>

                                <div className="pie-right-side">

                                    <div className="distribution-legend">

                                        <div className="legend-item">
                                            <span className="legend-dot win"></span>
                                            <span>Wins</span>
                                            <strong>
                                                {analytics?.totalTrades > 0
                                                    ? ((winLossData[0]?.value / analytics.totalTrades) * 100).toFixed(0)
                                                    : 0}%
                                            </strong>
                                        </div>

                                        <div className="legend-item">
                                            <span className="legend-dot loss"></span>
                                            <span>Losses</span>
                                            <strong>
                                                {analytics?.totalTrades > 0
                                                    ? ((winLossData[1]?.value / analytics.totalTrades) * 100).toFixed(0)
                                                    : 0}%
                                            </strong>
                                        </div>

                                        <div className="legend-item">
                                            <span className="legend-dot breakeven"></span>
                                            <span>Breakeven</span>
                                            <strong>
                                                {analytics?.totalTrades > 0
                                                    ? ((winLossData[2]?.value / analytics.totalTrades) * 100).toFixed(0)
                                                    : 0}%
                                            </strong>
                                        </div>

                                    </div>



                                </div>

                            </div>

                            <div className="performance-banner">

                                <div className="performance-banner-icon"> 🏆</div>

                                <div className="performance-banner-content">

                                    <h4>Performance Insight</h4>
                                    <p>Your win rate improved by <strong>6%</strong>compared to last month.
                                        Keep focusing on momentum trades.

                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>


                    <div className="analytics-row-two">

                        <div className="strategy-card">

                            <div className="strategy-header">
                                <h3>Strategy Performance</h3>
                                <button className="small-filter-btn">
                                    By Total P&L
                                    <MdKeyboardArrowDown />
                                </button>
                            </div>

                            <div className="strategy-chart">
                                <ResponsiveContainer width="100%" height="100%">

                                    <BarChart
                                        data={strategyData}
                                        layout="vertical"
                                        barSize={24}
                                        margin={{
                                            top: 5,
                                            right: 55,
                                            left: -20,
                                            bottom: 0

                                        }}>

                                        <CartesianGrid
                                            horizontal={false}
                                            stroke="#eef2f7"
                                        />
                                        <XAxis
                                            type="number"
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{
                                                fontSize: 11,
                                                fill: "#64748b"
                                            }}
                                        />

                                        <YAxis
                                            dataKey="strategy"
                                            type="category"
                                            tickLine={false}
                                            axisLine={false}
                                            width={85}
                                            tick={{
                                                fontSize: 12,
                                                fill: "#18233b"
                                            }} />

                                        <Tooltip
                                            cursor={{ fill: "#f3e8ff" }}
                                            contentStyle={{
                                                background: "#faf5ff",
                                                border: "1px solid #ddd6fe",
                                                borderRadius: "12px",
                                                boxShadow: "0 8px 20px rgba(91,33,182,.12)"
                                            }}
                                            labelStyle={{
                                                color: "#5b21b6",
                                                fontWeight: 600
                                            }}
                                            itemStyle={{
                                                color: "#7c3aed",
                                                fontWeight: 600
                                            }}
                                        />

                                        <Bar
                                            dataKey="pnl"
                                            radius={[0, 8, 8, 0]}>
                                            {strategyData.map((entry, index) => (
                                                <Cell
                                                    key={index}
                                                    fill={entry.pnl >= 0 ? "#7c3aed" : "#ef4444"} />
                                            ))}

                                            <LabelList
                                                dataKey="pnl"
                                                position="right"
                                                formatter={(value) => `₹${value.toLocaleString("en-IN")}`}
                                                style={{
                                                    fill: "#16a34a",
                                                    fontSize: 14,
                                                    fontWeight: 700
                                                }}
                                            />
                                        </Bar>

                                    </BarChart>

                                </ResponsiveContainer>

                            </div>
                        </div>

                        <div className="days-card">

                            <div className="days-header">
                                <h3>Best Trading Days</h3>
                            </div>


                            <div className="days-chart">

                                {bestDaysData.map((item) => (
                                    <div className="day-row" key={item.day}>

                                        <div className="day-info">
                                            <span>{item.day}</span>
                                            <strong>₹{item.pnl.toLocaleString("en-IN")}</strong>
                                        </div>

                                        <div className="day-progress">
                                            <div
                                                className="day-progress-fill"
                                                style={{
                                                    width: `${(Math.abs(item.pnl) / maxPnl) * 100}%`
                                                }} />
                                        </div>
                                    </div>

                                ))}

                            </div>
                        </div>
                    </div>


                    <div className="analytics-row-three">

                        {/* Holding Time */}
                        <div className="holding-card">

                            <div className="holding-header">
                                <h3>Holding Time vs Avg P&L</h3>
                                <button className="small-filter-btn">
                                    {dateFilter}
                                    <MdKeyboardArrowDown />
                                </button>
                            </div>

                            <div className="holding-chart">

                                <ResponsiveContainer width="100%" height="100%">

                                    <BarChart
                                        data={holdingTimeData}
                                        margin={{
                                            top: 20,
                                            right: 10,
                                            left: -10,
                                            bottom: 5
                                        }}>

                                        <CartesianGrid
                                            vertical={false}
                                            stroke="#eef2f7"
                                        />

                                        <XAxis
                                            dataKey="time"
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{
                                                fontSize: 14,
                                                fontWeight: 500,
                                                fill: "#344257"
                                            }}
                                        />

                                        <YAxis
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `${value / 1000}K`}
                                            tick={{
                                                fontSize: 12,
                                                fontWeight: 600,
                                                fill: "#344257"
                                            }}

                                        />

                                        <Tooltip
                                            cursor={{
                                                fill: "#f3e8ff"
                                            }}
                                            content={() => null}
                                        />

                                        <Bar
                                            dataKey="pnl"
                                            fill="#7c3aed"
                                            radius={[3, 3, 0, 0]}
                                            barSize={35} >

                                            <LabelList
                                                dataKey="pnl"
                                                position="top"
                                                formatter={(value) => `+₹${value.toLocaleString("en-IN")}`}
                                                style={{
                                                    fill: "#18233b",
                                                    fontWeight: 600,
                                                    fontSize: 13
                                                }} />

                                        </Bar>

                                    </BarChart>

                                </ResponsiveContainer>
                            </div>

                        </div>

                        {/* Risk Reward */}
                        <div className="risk-card">

                            <div className="holding-header">
                                <h3>Risk: Reward Distribution</h3>
                                <button className="small-filter-btn">
                                    {dateFilter}
                                    <MdKeyboardArrowDown />
                                </button>
                            </div>

                            <div className="holding-chart">

                                <ResponsiveContainer width="100%" height="100%">

                                    <BarChart data={riskRewardData}
                                        margin={{
                                            top: 20,
                                            right: 10,
                                            left: 0,
                                            bottom: 18
                                        }}>

                                        <CartesianGrid
                                            vertical={false}
                                            stroke="#eef2f7" />

                                        <XAxis
                                            dataKey="range"
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{
                                                fontSize: 12,
                                                fontWeight: 600,
                                                fill: "#334155"
                                            }}
                                        />

                                        <YAxis
                                            tickLine={false}
                                            axisLine={false}
                                            width={40}
                                            tick={{
                                                fontSize: 12,
                                                fontWeight: 600,
                                                fill: "#334155",
                                            }}
                                            label={{
                                                value: "Trades",
                                                angle: -90,
                                                position: "insideLeft",
                                                offset: 8,
                                                style: {
                                                    fill: "#64748b",
                                                    fontSize: 13,
                                                    fontWeight: 600,
                                                },
                                            }}
                                        />

                                        <Tooltip
                                            content={null}
                                            cursor={{
                                                fill: "#f3e8ff"
                                            }}
                                        />

                                        <Bar
                                            dataKey="trades"
                                            fill="#7c3aed"
                                            radius={[8, 8, 0, 0]}
                                            barSize={45}
                                        >

                                            <LabelList
                                                dataKey="trades"
                                                position="top"
                                                style={{
                                                    fill: "#18233b",
                                                    fontWeight: 700,
                                                    fontSize: 13
                                                }}
                                            />

                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                        </div>


                    </div>


                    <div className="analytics-row-four">

                        {/* ================= TOP WINNERS ================= */}
                        <div className="table-card">
                            <div className="table-header">
                                <h3>Top Winners</h3>
                                <button
                                    className="small-filter-btn"
                                    onClick={() => { }}
                                >
                                    {dateFilter} <MdKeyboardArrowDown />
                                </button>
                            </div>

                            <table className="stock-table">
                                <thead>
                                    <tr>
                                        <th className="col-rank">#</th>
                                        <th className="col-symbol">Symbol</th>
                                        <th className="col-pnl">Total P&amp;L</th>
                                        <th className="col-trades">Trades</th>
                                        <th className="col-rate">Win Rate</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {topWinners.map((stock) => (
                                        <tr key={stock.rank}>
                                            <td className="rank-cell">{stock.rank}</td>

                                            <td className="symbol-cell-td">
                                                <div className="symbol-wrapper">
                                                    <div className="stock-logo-purple">
                                                        {stock.symbol.charAt(0)}
                                                    </div>
                                                    <span className="stock-symbol">{stock.symbol}</span>
                                                </div>
                                            </td>

                                            <td className="profit">
                                                +₹{stock.pnl.toLocaleString("en-IN")}
                                            </td>

                                            <td className="trades-cell">{stock.trades}</td>

                                            <td className="profit">{stock.winRate}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>


                        {/* ================= BIGGEST LOSSES ================= */}
                        <div className="table-card">
                            <div className="table-header">
                                <h3>Biggest Losses</h3>
                                <button
                                    className="small-filter-btn"
                                    onClick={() => { }}
                                >
                                    {dateFilter} <MdKeyboardArrowDown />
                                </button>
                            </div>

                            <table className="stock-table">
                                <thead>
                                    <tr>
                                        <th className="col-rank">#</th>
                                        <th className="col-symbol">Symbol</th>
                                        <th className="col-pnl">Total P&amp;L</th>
                                        <th className="col-trades">Trades</th>
                                        <th className="col-rate">Loss Rate</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {biggestLosers.map((stock) => (
                                        <tr key={stock.rank}>
                                            <td className="rank-cell">{stock.rank}</td>

                                            <td className="symbol-cell-td">
                                                <div className="symbol-wrapper">
                                                    <div className="stock-logo-purple">
                                                        {stock.symbol.charAt(0)}
                                                    </div>
                                                    <span className="stock-symbol">{stock.symbol}</span>
                                                </div>
                                            </td>

                                            <td className="loss">
                                                -₹{Math.abs(stock.pnl).toLocaleString("en-IN")}
                                            </td>

                                            <td className="trades-cell">{stock.trades}</td>

                                            <td className="loss">{stock.lossRate}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>


                </div>
            </div>
        </div>
    )
}

export default Analytics;