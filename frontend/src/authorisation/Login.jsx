import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdTrendingUp } from "react-icons/md";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Quant Journal Header */}
        <div className="brand-header">
          <div className="logo-box">
            <MdTrendingUp className="logo-icon" />
          </div>
          <div className="brand-text">
            <h1 className="brand-title">Quant Journal</h1>
            <p className="brand-tagline">Trade • Analyze • Improve</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <h2>Welcome Back 👋</h2>
          <p className="left-tagline">Login to access your trading journal!</p>

          <form onSubmit={handleSubmit}>
            <label>Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <p className="forgot-password">Forgot Password?</p>

            <button type="submit" className="login-btn">
              Login
            </button>

            <p className="signup-text">
              Don't have an account?
              <span className="signup-link" onClick={() => navigate("/signup")}>
                {" "}
                Signup
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;