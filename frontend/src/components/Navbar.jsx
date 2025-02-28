import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/images/logo.png";  // Ensure correct path

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo & Title on the Left */}
        <div className="logo-title">
          <Link to="/">
            <img src={logo} alt="Blood Bank Logo" className="logo" />
          </Link>
          <h1>Blood Bank Donation</h1>
        </div>

        {/* Navigation Links in the Center */}
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/donate-blood">Donate Blood</Link></li>
        </ul>

        {/* Sign In on the Right */}
        <div className="signin-btn">
          <Link to="/signin">Signin</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
