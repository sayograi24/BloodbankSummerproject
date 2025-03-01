import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DonateBloodPopup.css";

function DonateBloodPopup({ onClose }) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/donate-blood");
    }
  }, [navigate]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submission (Signup or Signin)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    setLoading(true); // Start loading

    const url = isSignup ? "http://localhost:5000/signup" : "http://localhost:5000/signin";

    try {
      const res = await axios.post(url, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (isSignup) {
        // ✅ Redirect to Sign In Page after successful signup
        setIsSignup(false);
        setMessage("Signup successful! Please sign in.");
      } else {
        // ✅ Store token and user data in localStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // ✅ Notify Navbar to update
        window.dispatchEvent(new Event("storage"));

        // ✅ Redirect to donate blood page
        navigate("/donate-blood");
      }
    } catch (error) {
      console.error("Error:", error.response?.data);
      setMessage(error.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-modal">
        <h2>{isSignup ? "Sign Up" : "Sign In"} to Donate</h2>

        {message && <p className="error">{message}</p>}

        {/* ✅ Sign In / Sign Up Form */}
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="action-btn">
            {loading ? "Processing..." : isSignup ? "Sign Up" : "Sign In"}
          </button>
        </form>

        {/* ✅ Toggle between Sign In / Sign Up */}
        <p>
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={() => setIsSignup(!isSignup)} className="toggle-btn">
            {isSignup ? "Sign In" : "Sign Up"}
          </button>
        </p>

        {/* ✅ Close Button */}
        <button onClick={onClose} className="close-btn">✖</button>
      </div>
    </div>
  );
}

export default DonateBloodPopup;
