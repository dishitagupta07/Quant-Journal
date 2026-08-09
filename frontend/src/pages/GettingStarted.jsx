import React from "react";
import "./GettingStarted.css";
import { useNavigate } from "react-router-dom";
import {
  MdShowChart,
  MdDashboard,
  MdAssignment,
  MdBarChart,
  MdCalendarToday,
  MdArrowForward,
} from "react-icons/md";

function GettingStarted() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">

      <header className="navbar">
        <div className="nav-brand">
          <div className="brand-logo-icon">
            <MdShowChart size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-title">Quant Journal</span>
            <span className="brand-sub">Trade • Analyze • Improve</span>
          </div>
        </div>
        <button className="nav-login-btn" onClick={() => navigate("/login")}>
          Login
        </button>
      </header>


      <section className="hero-section-stacked">
      
        <div className="hero-banner-container">
          <img
            src="/images/quant-logo1.png"
            alt="Quant Journal Desk Banner"
            className="quant-banner-img"
          />
        </div>

       
        <div className="hero-content-stacked">
          <div className="hero-badge">
            <MdShowChart size={18} />
            <span>Your personal trading journal</span>
          </div>

          <h1 className="hero-heading">
            Quant <span className="highlight">Journal</span>
          </h1>

          <div className="hero-tags">
            <span>TRADE</span> • <span>ANALYZE</span> • <span>IMPROVE</span>
          </div>

          <p className="hero-description">
            Log every trade, see the patterns hiding in your performance, and
            build the discipline that actually moves your edge — all in one place.
          </p>
        </div>
      </section>


      <div className="ticker-bar-static">
        <div className="ticker-container">
          <div className="ticker-item">
            <span className="ticker-label">NIFTY</span>
            <span className="ticker-value">24,812</span>
            <span className="ticker-change positive">▲ +0.42%</span>
          </div>
          <div className="ticker-item">
            <span className="ticker-label">WIN RATE</span>
            <span className="ticker-value positive">▲ 61%</span>
          </div>
          <div className="ticker-item">
            <span className="ticker-label">AVG RR</span>
            <span className="ticker-value positive">▲ 1.8R</span>
          </div>
          <div className="ticker-item">
            <span className="ticker-label">BANKNIFTY</span>
            <span className="ticker-value">51,204</span>
            <span className="ticker-change negative">▼ -0.21%</span>
          </div>
          <div className="ticker-item">
            <span className="ticker-label">TRADES LOGGED</span>
            <span className="ticker-value positive">▲ 1,284</span>
          </div>
        </div>
      </div>

 
      <section className="features-section">
        <div className="section-kicker">WHAT'S INSIDE</div>
        <h2 className="section-title">A journal that thinks like a trading desk</h2>
        <p className="section-subtitle">
          Not another spreadsheet. Every screen is built around the numbers that
          actually explain why you win or lose.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="card-icon">
              <MdDashboard size={24} />
            </div>
            <h3>Dashboard</h3>
            <p>
              Overview of your recent metrics, active strategies, P&L stats, and overall account equity.
            </p>
          </div>

          <div className="feature-card">
            <div className="card-icon">
              <MdAssignment size={24} />
            </div>
            <h3>Trade Log</h3>
            <p>
              Record every entry, exit, position size, and reasoning — in seconds, not spreadsheets.
            </p>
          </div>

          <div className="feature-card">
            <div className="card-icon">
              <MdBarChart size={24} />
            </div>
            <h3>Analytics</h3>
            <p>
              Win rate, average R, expectancy, and deep breakdowns that reveal your true trading edge.
            </p>
          </div>

          <div className="feature-card">
            <div className="card-icon">
              <MdCalendarToday size={22} />
            </div>
            <h3>Calendar View</h3>
            <p>
              Track daily P&L, see session performance, and spot performance trends across the month.
            </p>
          </div>
        </div>
      </section>

    
      <section className="loop-section">
        <div className="section-kicker">THE LOOP</div>
        <h2 className="section-title">Record. Reflect. Improve.</h2>
        <p className="section-subtitle">
          The same three steps, every single trading day — until they're not a
          checklist anymore, just how you trade.
        </p>

        <div className="loop-steps">
          <div className="step-card">
            <div className="step-num">01</div>
            <h3>Record</h3>
            <p>
              Log the trade the moment it closes, while the reasoning is still
              fresh in your head.
            </p>
          </div>

          <div className="step-card">
            <div className="step-num">02</div>
            <h3>Reflect</h3>
            <p>
              Review what actually happened against your plan — not just the P&L
              number.
            </p>
          </div>

          <div className="step-card">
            <div className="step-num">03</div>
            <h3>Improve</h3>
            <p>
              Turn recurring mistakes into rules you follow, and recurring wins
              into a repeatable setup.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-card">
          <div className="cta-content">
            <h2>Start your first entry in under a minute.</h2>
            <p>Free to start. No credit card, no spreadsheet migration headache.</p>
            <button
              className="btn-primary cta-btn"
              onClick={() => navigate("/signup")}
            >
              Get Started <MdArrowForward size={18} />
            </button>
          </div>

          <div className="cta-image-wrapper">
            <div className="cta-preview-box">
              <img
                src="/images/quant-logo.png"
                alt="Quant Logo"
                className="cta-preview-img"
              />
            </div>
          </div>
        </div>
      </section>

      
      <footer className="footer">
        <div className="footer-links">
          <span>Record.</span>
          <span>Reflect.</span>
          <span>Improve.</span>
        </div>
      </footer>
    </div>
  );
}

export default GettingStarted;