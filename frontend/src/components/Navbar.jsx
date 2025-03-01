import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";
import logo from "../assets/images/logo.png"; // Ensure correct path

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  // ✅ Update navbar when auth state changes
  useEffect(() => {
    const updateAuthState = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", updateAuthState);
    return () => {
      window.removeEventListener("storage", updateAuthState);
    };
  }, []);

  // ✅ Handle Sign Out
  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
    window.dispatchEvent(new Event("storage")); // ✅ Force navbar update
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo-title">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Blood Bank Logo" className="logo" />
            <h1 className="brand-name">Blood Bank Donation</h1>
          </Link>
        </div>

        <ul className="nav-links">
          <li><Link to="/" className="nav-item">Home</Link></li>
          <li><Link to="/about" className="nav-item">About</Link></li>
          <li><Link to="/contact" className="nav-item">Contact</Link></li>
          <li><Link to="/donate-blood" className="nav-item">Donate Blood</Link></li>
        </ul>

        {/* ✅ Dynamic Sign In/Out Button */}
        <div className="auth-btn">
          {isLoggedIn ? (
            <button onClick={handleSignOut} className="signout-btn">Sign Out</button>
          ) : (
            <Link to="/signin" className="signin-btn">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
