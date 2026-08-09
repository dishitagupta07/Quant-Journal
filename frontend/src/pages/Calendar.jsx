import "./Calendar.css";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import {
    MdCalendarMonth,
    MdKeyboardArrowDown,
} from "react-icons/md";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Calendar() {
    const [trades, setTrades] = useState([]);
    const [hoverData, setHoverData] = useState(null);
    const [range, setRange] = useState("Year");
    const [selectedDate, setSelectedDate] = useState(null);
    const [timeRange, setTimeRange] = useState("Year");
    const [viewMode, setViewMode] = useState("Year");
    const [metric, setMetric] = useState("pnl");
    const [currentYear, setCurrentYear] = useState(
        new Date().getFullYear()
    );

    

    useEffect(() => {
        const fetchTrades = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:8000/api/trades",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch trades");
                }

                const data = await response.json();

                setTrades(data);

            } catch (error) {
                console.error("Error fetching trades:", error);
            }
        };

        fetchTrades();
    }, []);

    

    const tradeByDate = {};

    trades.forEach((trade) => {
        const date = new Date(trade.tradeDate);

        if (isNaN(date.getTime())) return;

        const key = `${date.getFullYear()}-${String(
            date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(
            2,
            "0"
        )}`;

        if (!tradeByDate[key]) {
            tradeByDate[key] = {
                pnl: 0,
                trades: 0,
                wins: 0,
                losses: 0,
            };
        }

        const pnl = Number(trade.profitLoss || 0);

        tradeByDate[key].pnl += pnl;
        tradeByDate[key].trades++;

        if (pnl > 0) {
            tradeByDate[key].wins++;
        } else if (pnl < 0) {
            tradeByDate[key].losses++;
        }
    });

    

    const getDateKey = (date) => {
        return `${date.getFullYear()}-${String(
            date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(
            2,
            "0"
        )}`;
    };

   

    const formatMoney = (value) => {
        const number = Number(value || 0);

        if (number > 0) {
            return `+₹${number.toLocaleString("en-IN")}`;
        }

        if (number < 0) {
            return `-₹${Math.abs(number).toLocaleString("en-IN")}`;
        }

        return "₹0";
    };

    // ================= GET HEATMAP CLASS =================
    const getCellClass = (info) => {
        if (!info || info.trades === 0) {
            return "no-trade";
        }

        if (metric === "pnl") {
            if (info.pnl > 0) return "profitable";
            if (info.pnl < 0) return "losing";
            return "breakeven";
        }

        if (metric === "trades") {
            if (info.trades >= 5) return "profitable";
            if (info.trades >= 2) return "breakeven";
            return "losing";
        }

        if (metric === "winRate") {
            const winRate = (info.wins / info.trades) * 100;

            if (winRate >= 70) return "profitable";
            if (winRate >= 40) return "breakeven";
            return "losing";
        }

        return "no-trade";
    };

    // ================= GET MONTHLY DATA =================

    const getMonthlyTrades = (month) => {
        return trades.filter((trade) => {
            const date = new Date(trade.tradeDate);

            return (
                date.getFullYear() === currentYear &&
                date.getMonth() === month
            );
        });
    };

    // ================= SELECTED DAY =================

    const selectedDayTrades = selectedDate
        ? trades.filter((trade) => {
            return (
                getDateKey(new Date(trade.tradeDate)) ===
                getDateKey(selectedDate)
            );
        })
        : [];

    const selectedDayPnL = selectedDayTrades.reduce(
        (sum, trade) => sum + Number(trade.profitLoss || 0),
        0
    );

    const selectedDayWins = selectedDayTrades.filter(
        (trade) => Number(trade.profitLoss || 0) > 0
    ).length;

    const selectedDayWinRate =
        selectedDayTrades.length > 0
            ? Math.round(
                (selectedDayWins /
                    selectedDayTrades.length) *
                100
            )
            : 0;

    // ================= MONTHLY SUMMARY =================

    const currentMonth = new Date().getMonth();

    const monthlyTrades = getMonthlyTrades(currentMonth);

    const monthlyPnL = monthlyTrades.reduce(
        (sum, trade) => sum + Number(trade.profitLoss || 0),
        0
    );

    const monthlyDays = {};

    monthlyTrades.forEach((trade) => {
        const date = new Date(trade.tradeDate);

        const key = getDateKey(date);

        if (!monthlyDays[key]) {
            monthlyDays[key] = {
                pnl: 0,
                trades: 0,
            };
        }

        monthlyDays[key].pnl += Number(trade.profitLoss || 0);
        monthlyDays[key].trades++;
    });

    const tradingDays = Object.keys(monthlyDays).length;

    const profitableDays = Object.values(monthlyDays).filter(
        (day) => day.pnl > 0
    ).length;

    const losingDays = Object.values(monthlyDays).filter(
        (day) => day.pnl < 0
    ).length;

    const breakevenDays = Object.values(monthlyDays).filter(
        (day) => day.pnl === 0
    ).length;

    // ================= RECENT TRADING DAYS =================

    const recentDaysMap = {};

    trades.forEach((trade) => {
        const date = new Date(trade.tradeDate);

        const key = getDateKey(date);

        if (!recentDaysMap[key]) {
            recentDaysMap[key] = {
                date,
                pnl: 0,
                trades: 0,
            };
        }

        recentDaysMap[key].pnl += Number(trade.profitLoss || 0);
        recentDaysMap[key].trades++;
    });

    const recentDays = Object.values(recentDaysMap)
        .sort((a, b) => b.date - a.date)
        .slice(0, 5);

    // ================= YEAR CALENDAR =================

    let firstDay;

    if (viewMode === "Year") {
        firstDay = new Date(currentYear, 0, 1);
    } else {
        const months =
            viewMode === "6M"
                ? 6
                : viewMode === "3M"
                    ? 3
                    : 1;

        const baseMonth = selectedDate
            ? selectedDate.getMonth()
            : new Date().getMonth();

        firstDay = new Date(
            currentYear,
            baseMonth - months + 1,
            1
        );
    }

    
    let startingDay = firstDay.getDay();

    startingDay =
        startingDay === 0 ? 6 : startingDay - 1;

    const daysInYear =
        (new Date(currentYear + 1, 0, 1) -
            new Date(currentYear, 0, 1)) /
        (1000 * 60 * 60 * 24);

    const totalCells = 24 * 11;

    const calendarCells = Array.from({
        length: totalCells,
    });

    // ================= MONTH NAME =================

    const monthName = new Date(
        currentYear,
        currentMonth,
        1
    ).toLocaleString("default", {
        month: "short",
    });

    const today = new Date();

    let rangeStart;

    if (timeRange === "Year") {
        rangeStart = new Date(currentYear, 0, 1);
    } else if (timeRange === "6M") {
        rangeStart = new Date(today);
        rangeStart.setMonth(today.getMonth() - 5);
    } else if (timeRange === "3M") {
        rangeStart = new Date(today);
        rangeStart.setMonth(today.getMonth() - 2);
    } else {
        rangeStart = new Date(today);
    }

    const isDateInRange = (date) => {
        if (timeRange === "Year") {
            return date.getFullYear() === currentYear;
        }

        const end = new Date(currentYear, currentMonth + 1, 0);

        let monthsBack = 0;

        if (timeRange === "6M") monthsBack = 5;
        if (timeRange === "3M") monthsBack = 2;
        if (timeRange === "1M") monthsBack = 0;

        const start = new Date(
            currentYear,
            currentMonth - monthsBack,
            1
        );

        return date >= start && date <= end;
    };

    const maxTrades = Math.max(
        ...Object.values(tradeByDate).map(
            (day) => day.trades
        ),
        1
    );

    const getActivityLevel = (tradeCount) => {

        if (!tradeCount) return 0;

        const ratio =
            tradeCount / maxTrades;

        if (ratio <= 0.25) return 1;
        if (ratio <= 0.5) return 2;
        if (ratio <= 0.75) return 3;

        return 4;
    };

    return (
        <div className="dashboard-container">
            <Sidebar />

            <div className="main-wrapper">
                <TopNavbar />

                <div className="main-content">

                    

                    <div className="calendar-header">

                        <div className="calendar-header-left">

                            <div className="calendar-title">
                                <MdCalendarMonth />

                                <h1>
                                    Trading Heatmap
                                </h1>
                            </div>

                            <p>
                                See your performance at a glance.
                                Every square is a day.
                            </p>

                        </div>

                        <div className="calendar-legend">

                            <div className="legend-item">
                                <span className="legend-dot profitable"></span>
                                Profitable
                            </div>

                            <div className="legend-item">
                                <span className="legend-dot losing"></span>
                                Losing
                            </div>

                            <div className="legend-item">
                                <span className="legend-dot breakeven"></span>
                                Breakeven
                            </div>

                            <div className="legend-item">
                                <span className="legend-dot neutral"></span>
                                No Trades
                            </div>

                        </div>

                    </div>

                    

                    <div className="dashboard-grid">

                        

                        <div className="left-column">

                            <div className="heatmap-card">

                                

                                <div className="heatmap-controls">

                                    <div className="heatmap-left-controls">

                                        {["Year", "6M", "3M", "1M"].map((mode) => (
                                            <button
                                                key={mode}
                                                className={viewMode === mode ? "active-tab" : ""}
                                                onClick={() => setViewMode(mode)}
                                            >
                                                {mode}
                                            </button>
                                        ))}

                                    </div>

                                    <div className="heatmap-center-controls">

                                        <button
                                            className="year-arrow"
                                            onClick={() =>
                                                setCurrentYear(
                                                    currentYear - 1
                                                )
                                            }
                                        >
                                            ❮
                                        </button>

                                        <h2>
                                            {currentYear}
                                        </h2>

                                        <button
                                            className="year-arrow"
                                            onClick={() =>
                                                setCurrentYear(
                                                    currentYear + 1
                                                )
                                            }
                                        >
                                            ❯
                                        </button>

                                    </div>

                                    <select
                                        className="metric-btn"
                                        value={metric}
                                        onChange={(e) => setMetric(e.target.value)}
                                    >
                                        <option value="pnl">P&L (Net)</option>
                                        <option value="trades">Trades</option>
                                        <option value="winRate">Win Rate</option>
                                    </select>

                                </div>

                                

                                <div className="heatmap-months">

                                    <span></span>

                                    {[
                                        "Jan",
                                        "Feb",
                                        "Mar",
                                        "Apr",
                                        "May",
                                        "Jun",
                                        "Jul",
                                        "Aug",
                                        "Sep",
                                        "Oct",
                                        "Nov",
                                        "Dec",
                                    ].map((month) => (
                                        <span key={month}>
                                            {month}
                                        </span>
                                    ))}

                                </div>

                                

                                <div className="heatmap-body">

                                    <div className="weekday-labels">

                                        <span>Mon</span>
                                        <span>Tue</span>
                                        <span>Wed</span>
                                        <span>Thu</span>
                                        <span>Fri</span>
                                        <span>Sat</span>
                                        <span>Sun</span>

                                    </div>

                                    <div className="heatmap-grid">

                                        {calendarCells.map(
                                            (_, index) => {

                                                const dayIndex =
                                                    index -
                                                    startingDay;

                                                const date =
                                                    new Date(
                                                        currentYear,
                                                        0,
                                                        dayIndex + 1
                                                    );

                                                if (
                                                    dayIndex < 0 ||
                                                    dayIndex >=
                                                    daysInYear
                                                ) {
                                                    return (
                                                        <div
                                                            key={index}
                                                            className="heatmap-cell empty"
                                                        />
                                                    );
                                                }

                                                const key =
                                                    getDateKey(
                                                        date
                                                    );

                                                const info =
                                                    isDateInRange(date)
                                                        ? tradeByDate[key]
                                                        : null;

                                                return (
                                                    <div
                                                        key={index}
                                                        className={`heatmap-cell ${metric === "pnl"
                                                            ? getCellClass(info)
                                                            : info
                                                                ? info.trades >= 4
                                                                    ? "profitable"
                                                                    : info.trades >= 2
                                                                        ? "breakeven"
                                                                        : "no-trade"
                                                                : "no-trade"
                                                            }`}

                                                        onMouseEnter={(
                                                            e
                                                        ) => {

                                                            if (!info)
                                                                return;

                                                            const rect =
                                                                e.currentTarget.getBoundingClientRect();

                                                            const winRate =
                                                                info.trades >
                                                                    0
                                                                    ? Math.round(
                                                                        (info.wins /
                                                                            info.trades) *
                                                                        100
                                                                    )
                                                                    : 0;

                                                            setHoverData(
                                                                {
                                                                    date: date.toLocaleDateString(
                                                                        "en-US",
                                                                        {
                                                                            month: "short",
                                                                            day: "numeric",
                                                                            year: "numeric",
                                                                        }
                                                                    ),

                                                                    pnl: formatMoney(
                                                                        info.pnl
                                                                    ),

                                                                    trades:
                                                                        info.trades,

                                                                    winRate: `${winRate}%`,

                                                                    x:
                                                                        rect.left +
                                                                        rect.width /
                                                                        2,

                                                                    y:
                                                                        rect.top,
                                                                }
                                                            );
                                                        }}

                                                        onMouseLeave={() =>
                                                            setHoverData(
                                                                null
                                                            )
                                                        }

                                                        onClick={() =>
                                                            setSelectedDate(
                                                                date
                                                            )
                                                        }
                                                    />
                                                );
                                            }
                                        )}

                                    </div>
                                </div>

                                <div className="heatmap-gradient">

                                    <span>
                                        ← Worst
                                    </span>

                                    <div className="gradient-bar"></div>

                                    <span>
                                        Best →
                                    </span>

                                </div>

                            </div>

                            

                            <div className="recent-days-card">

                                <div className="recent-header">

                                    <h3>
                                        Recent Trading Days
                                    </h3>

                                    <Link to="/trades">
                                        View All
                                    </Link>

                                </div>

                                <div className="recent-days-grid">

                                    {recentDays.length === 0 ? (

                                        <p>
                                            No trades yet.
                                        </p>

                                    ) : (

                                        recentDays.map(
                                            (trade) => {

                                                const pnl =
                                                    trade.pnl;

                                                return (
                                                    <div
                                                        className="trade-card"
                                                        key={getDateKey(
                                                            trade.date
                                                        )}
                                                    >

                                                        <p className="trade-date">
                                                            {trade.date.toLocaleDateString(
                                                                "en-US",
                                                                {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    year: "numeric",
                                                                }
                                                            )}
                                                        </p>

                                                        <span className="trade-day">
                                                            {trade.date.toLocaleDateString(
                                                                "en-US",
                                                                {
                                                                    weekday: "short",
                                                                }
                                                            )}
                                                        </span>

                                                        <h2
                                                            className={
                                                                pnl >
                                                                    0
                                                                    ? "green"
                                                                    : pnl <
                                                                        0
                                                                        ? "red"
                                                                        : ""
                                                            }
                                                        >
                                                            {formatMoney(
                                                                pnl
                                                            )}
                                                        </h2>

                                                        <p className="trade-count">
                                                            {
                                                                trade.trades
                                                            }{" "}
                                                            Trades
                                                        </p>

                                                    </div>
                                                );
                                            }
                                        )
                                    )}

                                </div>

                            </div>

                        </div>

                        

                        <div className="right-column">

                            

                            <div className="side-card">

                                <div className="side-card-header">

                                    <h3>
                                        Selected Day
                                    </h3>

                                    <span>
                                        {selectedDate
                                            ? selectedDate.toLocaleDateString(
                                                "en-US",
                                                {
                                                    weekday: "short",
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                }
                                            )
                                            : "Click a day"}
                                    </span>

                                </div>

                                <div className="stats-row">

                                    <div>

                                        <h2
                                            className={
                                                selectedDayPnL >
                                                    0
                                                    ? "green"
                                                    : selectedDayPnL <
                                                        0
                                                        ? "red"
                                                        : ""
                                            }
                                        >
                                            {formatMoney(
                                                selectedDayPnL
                                            )}
                                        </h2>

                                        <p>
                                            Net P&amp;L
                                        </p>

                                    </div>

                                    <div>

                                        <h2>
                                            {
                                                selectedDayTrades.length
                                            }
                                        </h2>

                                        <p>
                                            Trades
                                        </p>

                                    </div>

                                    <div>

                                        <h2>
                                            {
                                                selectedDayWinRate
                                            }
                                            %
                                        </h2>

                                        <p>
                                            Win Rate
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* Monthly Summary */}

                            <div className="side-card">

                                <div className="side-card-header">

                                    <h3>
                                        Monthly Summary
                                    </h3>

                                    <span>
                                        {monthName}{" "}
                                        {currentYear}
                                    </span>

                                </div>

                                <div className="summary-item">

                                    <span>
                                        Trading Days
                                    </span>

                                    <strong>
                                        {tradingDays}
                                    </strong>

                                </div>

                                <div className="summary-item">

                                    <span>
                                        Profitable Days
                                    </span>

                                    <strong className="green">

                                        {profitableDays}

                                        {tradingDays > 0 &&
                                            ` (${Math.round(
                                                (profitableDays /
                                                    tradingDays) *
                                                100
                                            )}%)`}

                                    </strong>

                                </div>

                                <div className="summary-item">

                                    <span>
                                        Losing Days
                                    </span>

                                    <strong className="red">

                                        {losingDays}

                                        {tradingDays > 0 &&
                                            ` (${Math.round(
                                                (losingDays /
                                                    tradingDays) *
                                                100
                                            )}%)`}

                                    </strong>

                                </div>

                                <div className="summary-item">

                                    <span>
                                        Breakeven Days
                                    </span>

                                    <strong className="orange">

                                        {breakevenDays}

                                        {tradingDays > 0 &&
                                            ` (${Math.round(
                                                (breakevenDays /
                                                    tradingDays) *
                                                100
                                            )}%)`}

                                    </strong>

                                </div>

                                <div className="summary-item total">

                                    <span>
                                        Total P&amp;L
                                    </span>

                                    <strong
                                        className={
                                            monthlyPnL >
                                                0
                                                ? "green"
                                                : monthlyPnL <
                                                    0
                                                    ? "red"
                                                    : ""
                                        }
                                    >
                                        {formatMoney(
                                            monthlyPnL
                                        )}
                                    </strong>

                                </div>

                            </div>

                            

                            <div className="side-card">

                                <h3>Activity Heatmap</h3>

                                <div className="activity-heatmap">

                                    {Array.from({ length: 42 }).map((_, i) => {

                                        const date = new Date(
                                            currentYear,
                                            currentMonth,
                                            i + 1
                                        );

                                        const key = getDateKey(date);
                                        const info = tradeByDate[key];

                                        const isCurrentMonth =
                                            date.getMonth() === currentMonth &&
                                            date.getFullYear() === currentYear;

                                        if (!isCurrentMonth) {
                                            return (
                                                <div
                                                    key={i}
                                                    className="activity-day empty"
                                                />
                                            );
                                        }

                                        const active = info && info.trades > 0;

                                        return (
                                            <div
                                                key={i}
                                                className={`activity-day ${active ? "active" : "inactive"
                                                    }`}
                                                title={
                                                    active
                                                        ? `${date.toLocaleDateString()} • ${info.trades} trade${info.trades > 1 ? "s" : ""}`
                                                        : `${date.toLocaleDateString()} • No trades`
                                                }
                                            />
                                        );
                                    })}

                                </div>

                            </div>

                        </div>

                    </div>

                    

                    {hoverData && (

                        <div
                            className="heatmap-tooltip"
                            style={{
                                left: hoverData.x,
                                top:
                                    hoverData.y -
                                    10,
                            }}
                        >

                            <h4>
                                {hoverData.date}
                            </h4>

                            <div className="tooltip-row">

                                <span>
                                    P&amp;L
                                </span>

                                <strong>
                                    {hoverData.pnl}
                                </strong>

                            </div>

                            <div className="tooltip-row">

                                <span>
                                    Trades
                                </span>

                                <strong>
                                    {hoverData.trades}
                                </strong>

                            </div>

                            <div className="tooltip-row">

                                <span>
                                    Win Rate
                                </span>

                                <strong>
                                    {hoverData.winRate}
                                </strong>

                            </div>

                        </div>

                    )}

                </div>
            </div>
        </div>
    );
}

export default Calendar;