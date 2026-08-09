import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdTrendingUp } from "react-icons/md";
import "./Signup.css";

function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setFullName("");
        setEmail("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        {/* Quant Journal Branding Header */}
        <div className="brand-header">
          <div className="logo-box">
            <MdTrendingUp className="logo-icon" />
          </div>
          <div className="brand-text">
            <h1 className="brand-title">Quant Journal</h1>
            <p className="brand-tagline">Trade • Analyze • Improve</p>
          </div>
        </div>

        {/* Signup Card */}
        <div className="signup-card">
          <h2>Create Account 🚀</h2>
          <p className="left-tagline">Start tracking your trades today!</p>

          <form onSubmit={handleSubmit}>
            <label>Full Name:</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <label>Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Username:</label>
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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

            <label>Confirm Password:</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit" className="signup-btn">
              Create Account
            </button>

            <p className="signup-text">
              Already have an account?
              <span className="signup-link" onClick={() => navigate("/login")}>
                {" "}
                Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;