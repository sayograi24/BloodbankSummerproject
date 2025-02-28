import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signin.css";  // ✅ Link CSS

function Signin() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/signin", user);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/donate-blood");
    } catch (error) {
      setMessage("Error: " + error.response.data.error);
    }
  };

  return (
    <div className="signin-container">
      <h2>Signin</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Signin</button>
      </form>
      {message && <p>{message}</p>}

      <div className="switch-container">
        <p>Don't have an account? <button className="switch-btn" onClick={() => navigate("/signup")}>Signup</button></p>
      </div>
    </div>
  );
}

export default Signin;
