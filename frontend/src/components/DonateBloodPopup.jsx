import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DonateBloodPopup.css";

function DonateBloodPopup({ onClose }) {
  const [isSignup, setIsSignup] = useState(false); // Toggle between Sign In and Sign Up
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission (Sign In or Sign Up)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isSignup ? "http://localhost:5000/signup" : "http://localhost:5000/signin";

    try {
      const res = await axios.post(url, formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/donate-blood");
    } catch (error) {
      setMessage(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-modal">
        <h2>{isSignup ? "Sign Up" : "Sign In"} to Donate</h2>
        
        {message && <p className="error">{message}</p>}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
          )}
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

          <button type="submit" className="action-btn">
            {isSignup ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p>
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={() => setIsSignup(!isSignup)} className="toggle-btn">
            {isSignup ? "Sign In" : "Sign Up"}
          </button>
        </p>

        <button onClick={onClose} className="close-btn">✖</button>
      </div>
    </div>
  );
}

export default DonateBloodPopup;
