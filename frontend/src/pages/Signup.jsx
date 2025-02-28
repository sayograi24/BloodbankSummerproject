import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css"; // ✅ Link to Signup-specific CSS

function Signup() {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/signup", user);
      setMessage("Signup successful! Redirecting...");
      setTimeout(() => navigate("/donate-blood"), 2000);
    } catch (error) {
      setMessage("Error: " + error.response.data.error);
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Signup</button>
      </form>
      {message && <p>{message}</p>}
      <p>Already have an account? <button className="switch-btn" onClick={() => navigate("/signin")}>Signin</button></p>
    </div>
  );
}

export default Signup;
