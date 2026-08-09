import "./Trades.css";
import {
  MdNorthEast,
  MdSouthEast,
  MdKeyboardArrowDown,
  MdFilterList,
  MdSearch
} from "react-icons/md";

import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import { useEffect, useState } from "react";

function Trades() {
  const [trades, setTrades] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [editingTrade, setEditingTrade] = useState(null);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");

  const [trade, setTrade] = useState({
    stockName: "",
    type: "BUY",
    entryPrice: "",
    exitPrice: "",
    quantity: "",
    strategy: "",
    tradeDate: "",
    stopLoss: ""
  });

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8000/api/trades",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      setTrades(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setTrade({
      ...trade,
      [e.target.name]: e.target.value
    });
  };

  const resetTrade = () => {
    setTrade({
      stockName: "",
      type: "BUY",
      entryPrice: "",
      exitPrice: "",
      quantity: "",
      strategy: "",
      tradeDate: "",
      stopLoss: ""
    });
  };

  const addTrade = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      let response;

      if (editingTrade) {
        response = await fetch(
          `http://localhost:8000/api/trades/${editingTrade._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(trade)
          }
        );

        const updatedTrade = await response.json();

        if (!response.ok) {
          throw new Error(
            updatedTrade.message || "Failed to update trade"
          );
        }

        setTrades((prev) =>
          prev.map((t) =>
            t._id === updatedTrade._id ? updatedTrade : t
          )
        );

        alert("Trade updated successfully");
      } else {
        response = await fetch(
          "http://localhost:8000/api/trades",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(trade)
          }
        );

        const newTrade = await response.json();

        if (!response.ok) {
          throw new Error(
            newTrade.message || "Failed to add trade"
          );
        }

        setTrades((prev) => [...prev, newTrade]);

        alert("Trade added successfully");
      }

      setShowForm(false);
      setEditingTrade(null);
      resetTrade();
    } catch (err) {
      console.log("TRADE ERROR:", err);
      alert(err.message);
    }
  };

  const filteredTrades = trades.filter((trade) => {
    const matchesSearch = trade.stockName
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesType =
      typeFilter === "ALL" ||
      trade.type === typeFilter;

    const matchesDate =
      dateFilter === "ALL" ||
      (
        trade.tradeDate &&
        new Date(trade.tradeDate).getMonth() ===
          new Date().getMonth()
      );

    return matchesSearch && matchesType && matchesDate;
  });

  const deleteTrade = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8000/api/trades/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete trade"
        );
      }

      setTrades((prev) =>
        prev.filter((trade) => trade._id !== id)
      );

      alert("Trade deleted successfully");
    } catch (err) {
      console.log("DELETE ERROR:", err);
      alert(err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-wrapper">
        <TopNavbar />

        <div className="main-content">

          <div className="dashboard-header">
            <div className="header-text">
              <h1>Trades</h1>
              <p>
                Track, review and analyze all your trades in one place.
              </p>
            </div>

            <button
              className="add-trade-btn"
              onClick={() => {
                setEditingTrade(null);
                resetTrade();
                setShowForm(true);
              }}
            >
              + Add Trade
            </button>
          </div>

          {showForm && (
            <div className="trade-modal-overlay">
              <div className="trade-modal">

                <div className="trade-modal-header">
                  <h2>
                    {editingTrade
                      ? "Edit Trade"
                      : "Add New Trade"}
                  </h2>

                  <button
                    className="close-modal-btn"
                    onClick={() => {
                      setShowForm(false);
                      setEditingTrade(null);
                      resetTrade();
                    }}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={addTrade}>

                  <input
                    name="stockName"
                    placeholder="Stock Name"
                    value={trade.stockName}
                    onChange={handleChange}
                    required
                  />

                  <select
                    name="type"
                    value={trade.type}
                    onChange={handleChange}
                  >
                    <option value="BUY">BUY</option>
                    <option value="SELL">SELL</option>
                  </select>

                  <input
                    name="entryPrice"
                    placeholder="Entry Price"
                    type="number"
                    value={trade.entryPrice}
                    onChange={handleChange}
                    required
                  />

                  <input
                    type="number"
                    name="stopLoss"
                    value={trade.stopLoss}
                    onChange={handleChange}
                    placeholder="Enter Stop Loss"
                  />

                  <input
                    name="exitPrice"
                    placeholder="Exit Price"
                    type="number"
                    value={trade.exitPrice}
                    onChange={handleChange}
                    required
                  />

                  <input
                    name="quantity"
                    placeholder="Quantity"
                    type="number"
                    value={trade.quantity}
                    onChange={handleChange}
                    required
                  />

                  <input
                    name="strategy"
                    placeholder="Strategy"
                    value={trade.strategy}
                    onChange={handleChange}
                    required
                  />

                  <input
                    name="tradeDate"
                    type="date"
                    value={trade.tradeDate}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="submit"
                    className="save-trade-btn"
                  >
                    {editingTrade
                      ? "Update Trade"
                      : "Save Trade"}
                  </button>

                </form>
              </div>
            </div>
          )}

          <div className="trades-toolbar">

            <div className="search-box">
              <MdSearch />

              <input
                type="text"
                placeholder="Search trades..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <div className="toolbar-actions">

              <button
                className="toolbar-btn"
                onClick={() => {
                  if (typeFilter === "ALL") {
                    setTypeFilter("BUY");
                  } else if (typeFilter === "BUY") {
                    setTypeFilter("SELL");
                  } else {
                    setTypeFilter("ALL");
                  }
                }}
              >
                <MdFilterList />

                <span>
                  {typeFilter === "ALL"
                    ? "Filters"
                    : typeFilter}
                </span>
              </button>

              <button
                className="toolbar-btn"
                onClick={() => {
                  if (dateFilter === "ALL") {
                    setDateFilter("MONTH");
                  } else {
                    setDateFilter("ALL");
                  }
                }}
              >
                {dateFilter === "ALL"
                  ? "All Trades"
                  : "This Month"}

                <MdKeyboardArrowDown />
              </button>

            </div>
          </div>

          <div className="trades-table-card">

            <div className="trades-table">

              <table>

                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Stock</th>
                    <th>Type</th>
                    <th>Entry</th>
                    <th>Exit</th>
                    <th>Quantity</th>
                    <th>P/L</th>
                    <th>Strategy</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTrades.map((trade) => {

                    const pnl =
                      trade.type === "BUY"
                        ? (
                            Number(trade.exitPrice) -
                            Number(trade.entryPrice)
                          ) * Number(trade.quantity)
                        : (
                            Number(trade.entryPrice) -
                            Number(trade.exitPrice)
                          ) * Number(trade.quantity);

                    return (
                      <tr key={trade._id}>

                        <td>
                          {trade.tradeDate
                            ? new Date(
                                trade.tradeDate
                              ).toLocaleDateString("en-GB")
                            : "-"}
                        </td>

                        <td>
                          <span className="symbol-name">
                            {trade.stockName}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`direction-badge ${
                              trade.type?.toLowerCase()
                            }`}
                          >
                            {trade.type === "BUY"
                              ? <MdNorthEast />
                              : <MdSouthEast />}

                            {trade.type}
                          </span>
                        </td>

                        <td>
                          ₹{trade.entryPrice}
                        </td>

                        <td>
                          ₹{trade.exitPrice}
                        </td>

                        <td>
                          {trade.quantity}
                        </td>

                        <td
                          className={`pnl-cell ${
                            pnl > 0
                              ? "profit"
                              : pnl < 0
                                ? "loss"
                                : "breakeven"
                          }`}
                        >
                          {pnl > 0 ? "+" : ""}
                          ₹{pnl}
                        </td>

                        <td>
                          {trade.strategy}
                        </td>

                        <td>
                          <div className="trade-actions">

                            <button
                              className="edit-btn"
                              onClick={() => {
                                setEditingTrade(trade);

                                setTrade({
                                  stockName:
                                    trade.stockName || "",
                                  type:
                                    trade.type || "BUY",
                                  entryPrice:
                                    trade.entryPrice || "",
                                  exitPrice:
                                    trade.exitPrice || "",
                                  quantity:
                                    trade.quantity || "",
                                  strategy:
                                    trade.strategy || "",
                                  tradeDate:
                                    trade.tradeDate
                                      ? trade.tradeDate.substring(0, 10)
                                      : "",
                                  stopLoss:
                                    trade.stopLoss || ""
                                });

                                setShowForm(true);
                              }}
                            >
                              ✏️
                            </button>

                            <button
                              className="delete-btn"
                              onClick={() => {
                                const confirmDelete =
                                  window.confirm(
                                    "Are you sure you want to delete this trade?"
                                  );

                                if (confirmDelete) {
                                  deleteTrade(trade._id);
                                }
                              }}
                            >
                              🗑️
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>

              </table>

              <div className="table-footer">
                <span>
                  Total Trades : {filteredTrades.length}
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Trades;