const express = require("express");
const Trade = require("../models/Trade");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ADD TRADE
router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            stockName,
            type,
            entryPrice,
            stopLoss,
            exitPrice,
            quantity,
            strategy,
            tradeDate,
        } = req.body;

        let profitLoss = 0;

        if (type === "BUY") {
            profitLoss =
                (Number(exitPrice) - Number(entryPrice)) * Number(quantity);
        } else {
            profitLoss =
                (Number(entryPrice) - Number(exitPrice)) * Number(quantity);
        }

        const risk = Math.abs(
            Number(entryPrice) - Number(stopLoss)
        );

        const reward = Math.abs(
            Number(exitPrice) - Number(entryPrice)
        );

        const rr =
            risk > 0
                ? (reward / risk).toFixed(2)
                : 0;

        const trade = new Trade({
            user: req.user.id,
            stockName,
            type,
            entryPrice,
            stopLoss,
            exitPrice,
            quantity,
            strategy,
            tradeDate: tradeDate ? new Date(tradeDate) : new Date(),
            profitLoss,
            rr
        });

        await trade.save();

        res.status(201).json(trade);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// GET ALL TRADES
router.get("/", authMiddleware, async (req, res) => {
    try {
        const trades = await Trade.find({ user: req.user.id }).sort({
            tradeDate: -1,
        });
        res.status(200).json(trades);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// DASHBOARD STATS
router.get("/stats", authMiddleware, async (req, res) => {
    try {
        const trades = await Trade.find({ user: req.user.id }).sort({
            tradeDate: 1,
        });

        let totalProfit = 0;
        let wins = 0;
        let losses = 0;
        let breakevens = 0;
        let lastWeekProfit = 0;
        const monthlyPnL = {};

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        trades.forEach((trade) => {
            const pnl = Number(trade.profitLoss || 0);
            const month = new Date(trade.tradeDate).toLocaleString("default", {
                month: "short",
            });

            if (!monthlyPnL[month]) {
                monthlyPnL[month] = 0;
            }

            monthlyPnL[month] += pnl;
            totalProfit += pnl;

            if (pnl > 0) wins++;
            else if (pnl < 0) losses++;
            else breakevens++;

            if (new Date(trade.tradeDate) >= sevenDaysAgo) {
                lastWeekProfit += pnl;
            }
        });

        const winRate =
            trades.length > 0
                ? ((wins / trades.length) * 100).toFixed(2)
                : 0;

        const averageRR =
            trades.length > 0
                ? (
                    trades.reduce(
                        (sum, trade) => sum + Number(trade.rr || 0),
                        0
                    ) / trades.length
                ).toFixed(2)
                : 0;

        // Build Cumulative Equity Curve
        let balance = 0;
        const equityData = trades.map((trade) => {
            balance += Number(trade.profitLoss || 0);
            return {
                day: new Date(trade.tradeDate).toISOString().split("T")[0],
                value: balance,
            };
        });

        // Donut Chart Performance Breakdown
        const performanceData = [
            { name: "Profitable", value: wins },
            { name: "Losing", value: losses },
            { name: "Breakeven", value: breakevens },
        ];

        const recentTrades = [...trades]
            .sort((a, b) => new Date(b.tradeDate) - new Date(a.tradeDate))
            .slice(0, 5);

        const monthlyPnLData = Object.keys(monthlyPnL).map((month) => ({
            month,
            profit: monthlyPnL[month],
        }));

        res.status(200).json({
            totalProfit,
            lastWeekProfit,
            winRate,
            averageRR,
            totalTrades: trades.length,
            performanceData,
            equityData,
            recentTrades,
            monthlyPnLData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ANALYTICS DATA
router.get("/analytics", authMiddleware, async (req, res) => {

    const {
        filter,
        dateFilter,
        strategyFilter,
        marketFilter,
        directionFilter,
    } = req.query;

    try {
        const now = new Date();

        let startDate = null;

        if (dateFilter === "This Year") {
            startDate = new Date(now.getFullYear(), 0, 1);
        } else if (dateFilter === "This Month") {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        } else if (dateFilter === "This Week") {
            const day = now.getDay();
            const diff = day === 0 ? 6 : day - 1;

            startDate = new Date(now);
            startDate.setDate(now.getDate() - diff);
            startDate.setHours(0, 0, 0, 0);
        } else if (dateFilter === "Last Month") {
            startDate = new Date(
                now.getFullYear(),
                now.getMonth() - 1,
                1
            );
        } else if (dateFilter === "All Time") {
            startDate = null;
        }

        const query = {
            user: req.user.id,
        };

        if (startDate) {
            query.tradeDate = { $gte: startDate };
        }

        if (strategyFilter && strategyFilter !== "All Strategies") {
            query.strategy = strategyFilter;
        }

        if (marketFilter && marketFilter !== "All Markets") {
            query.market = marketFilter;
        }

        if (directionFilter && directionFilter !== "All Directions") {
            query.direction = directionFilter;
        }

        const trades = await Trade.find(query);
        let filteredTrades = [...trades];

        if (strategyFilter && strategyFilter !== "All Strategies") {
            filteredTrades = filteredTrades.filter(
                (trade) => trade.strategy === strategyFilter
            );
        }

        if (marketFilter && marketFilter !== "All Markets") {
            filteredTrades = filteredTrades.filter(
                (trade) => trade.market === marketFilter
            );
        }

        if (directionFilter && directionFilter !== "All Directions") {
            filteredTrades = filteredTrades.filter(
                (trade) => trade.direction === directionFilter
            );
        }

        let totalProfit = 0;
        let totalLoss = 0;
        let totalRR = 0;

        let wins = 0;
        let losses = 0;
        let breakevens = 0;

        let bestTrade = null;
        let worstTrade = null;
        let balance = 0;
        let equityData = [];

        const monthlyPnL = {};

        filteredTrades.forEach((trade) => {
            const pnl = Number(trade.profitLoss || 0);

            // Monthly P&L
            const month = new Date(trade.tradeDate).toLocaleString("default", {
                month: "short",
            });

            if (!monthlyPnL[month]) {
                monthlyPnL[month] = 0;
            }

            monthlyPnL[month] += pnl;

            // Profit / Loss calculation
            if (pnl > 0) {
                totalProfit += pnl;
                wins++;
            } else if (pnl < 0) {
                totalLoss += Math.abs(pnl);
                losses++;
            } else {
                breakevens++;
            }

            if (bestTrade === null || pnl > Number(bestTrade.profitLoss || 0)) {
                bestTrade = trade;
            }

            if (worstTrade === null || pnl < Number(worstTrade.profitLoss || 0)) {
                worstTrade = trade;
            }

            // RR
            totalRR += Number(trade.rr || 0);
            balance += pnl;

            equityData.push({
                day: new Date(trade.tradeDate)
                    .toISOString()
                    .split("T")[0],
                value: balance,
            });
        });

        const averageWinningTrade =
            wins > 0
                ? (totalProfit / wins).toFixed(2)
                : 0;

        const averageLosingTrade =
            losses > 0
                ? (totalLoss / losses).toFixed(2)
                : 0;

        const profitFactor =
            totalLoss > 0
                ? (totalProfit / totalLoss).toFixed(2)
                : 0;

        const averageRR =
            filteredTrades.length > 0
                ? (totalRR / filteredTrades.length).toFixed(2)
                : 0;

        const expectancy =
            filteredTrades.length > 0
                ? ((totalProfit - totalLoss) / filteredTrades.length).toFixed(2)
                : 0;

        const monthlyPnLData = Object.keys(monthlyPnL).map((month) => ({
            month,
            profit: monthlyPnL[month],
        }));

        const strategyMap = {};

        filteredTrades.forEach((trade) => {
            const strategy = trade.strategy || "Unknown";

            if (!strategyMap[strategy]) {
                strategyMap[strategy] = 0;
            }

            strategyMap[strategy] += Number(trade.profitLoss || 0);
        });

        const strategyData = Object.entries(strategyMap).map(
            ([strategy, pnl]) => ({
                strategy,
                pnl,
            })
        );

        // Best Trading Days
        const bestDaysMap = {};

        filteredTrades.forEach((trade) => {
            const day = new Date(trade.tradeDate).toLocaleDateString("en-US", {
                weekday: "long",
            });

            if (!bestDaysMap[day]) {
                bestDaysMap[day] = 0;
            }

            bestDaysMap[day] += Number(trade.profitLoss || 0);
        });

        const bestDaysData = Object.entries(bestDaysMap).map(([day, pnl]) => ({
            day,
            pnl,
        }));

        // Holding Time Analytics
        const holdingMap = {
            "<30m": [],
            "30m-1h": [],
            "1h-2h": [],
            "2h-4h": [],
            "4h+": [],
        };

        filteredTrades.forEach((trade) => {
            const bucket = trade.holdingTime || "<30m";

            if (!holdingMap[bucket]) {
                holdingMap[bucket] = [];
            }

            holdingMap[bucket].push(Number(trade.profitLoss || 0));
        });

        const holdingTimeData = Object.entries(holdingMap).map(([time, values]) => ({
            time,
            pnl:
                values.length > 0
                    ? Math.round(
                        values.reduce((sum, value) => sum + value, 0) /
                        values.length
                    )
                    : 0,
        }));

        // Risk : Reward Distribution
        const riskRewardMap = {
            "0-1": 0,
            "1-2": 0,
            "2-3": 0,
            "3-4": 0,
            "4+": 0,
        };

        filteredTrades.forEach((trade) => {
            const rr = Number(trade.rr || 0);

            if (rr < 1) riskRewardMap["0-1"]++;
            else if (rr < 2) riskRewardMap["1-2"]++;
            else if (rr < 3) riskRewardMap["2-3"]++;
            else if (rr < 4) riskRewardMap["3-4"]++;
            else riskRewardMap["4+"]++;
        });

        const riskRewardData = Object.entries(riskRewardMap).map(
            ([range, count]) => ({
                range,
                trades: count,
            })
        );

        // ================= TOP WINNERS / BIGGEST LOSERS =================
        const stockMap = {};

        filteredTrades.forEach((trade) => {
            const stock = trade.stockName || "Unknown";

            if (!stockMap[stock]) {
                stockMap[stock] = {
                    symbol: stock,
                    pnl: 0,
                    trades: 0,
                    wins: 0,
                    losses: 0,
                };
            }

            const pnl = Number(trade.profitLoss || 0);

            stockMap[stock].pnl += pnl;
            stockMap[stock].trades++;

            if (pnl > 0) stockMap[stock].wins++;
            else if (pnl < 0) stockMap[stock].losses++;
        });

        const topWinners = Object.values(stockMap)
            .filter((stock) => stock.pnl > 0)
            .sort((a, b) => b.pnl - a.pnl)
            .slice(0, 5)
            .map((stock, index) => ({
                rank: index + 1,
                symbol: stock.symbol,
                pnl: stock.pnl,
                trades: stock.trades,
                winRate: stock.trades
                    ? Number(((stock.wins / stock.trades) * 100).toFixed(0))
                    : 0,
            }));

        const biggestLosers = Object.entries(stockMap)
            .filter(([symbol, data]) => data.pnl < 0)
            .map(([symbol, data]) => ({
                symbol,
                pnl: data.pnl,
                trades: data.trades,
                lossRate:
                    data.trades > 0
                        ? Math.round((data.losses / data.trades) * 100)
                        : 0,
            }))
            .sort((a, b) => a.pnl - b.pnl)
            .slice(0, 5)
            .map((stock, index) => ({
                ...stock,
                rank: index + 1,
            }));

        res.json({
            totalProfit,
            totalLoss,
            trades: filteredTrades,
            holdingTimeData,
            riskRewardData,
            averageRR,
            expectancy,
            bestTrade,
            strategyData,
            worstTrade,
            topWinners,
            biggestLosers,
            bestDaysData,
            totalTrades: trades.length,
            averageWinningTrade,
            averageLosingTrade,
            profitFactor,
            equityData,
            winRate:
                trades.length > 0
                    ? ((wins / trades.length) * 100).toFixed(2)
                    : 0,
            monthlyPnLData,
            winLossData: [
                {
                    name: "Wins",
                    value: wins,
                },
                {
                    name: "Losses",
                    value: losses,
                },
                {
                    name: "Breakeven",
                    value: breakevens,
                },
            ],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
});

// CALENDAR DATA
router.get("/calendar", authMiddleware, async (req, res) => {
    try {
        const trades = await Trade.find({
            user: req.user.id
        }).sort({
            tradeDate: 1
        });

        res.status(200).json(trades);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
});

// DELETE TRADE
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const trade = await Trade.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!trade) {
            return res.status(404).json({
                message: "Trade not found"
            });
        }

        res.status(200).json({
            message: "Trade deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
});


module.exports = router;