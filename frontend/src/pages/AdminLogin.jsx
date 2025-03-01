import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const [admin, setAdmin] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/admin/signin", admin);
      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin/dashboard");
    } catch (error) {
      setError(error.response?.data?.error || "Invalid credentials");
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2>Admin Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input 
              type="text" 
              name="email" 
              required 
              placeholder=" " 
              onChange={handleChange} 
              value={admin.email}
            />
            <label>Email</label>
          </div>

          <div className="input-container">
            <input 
              type="password" 
              name="password" 
              required 
              placeholder=" " 
              onChange={handleChange} 
              value={admin.password}
            />
            <label>Password</label>
          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
