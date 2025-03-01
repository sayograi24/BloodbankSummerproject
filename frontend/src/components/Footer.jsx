import React from "react";
import { FaFacebookF, FaGithub, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import logo from "../assets/images/logo.png"; // Import your logo
import "./Footer.css"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* 🔹 Footer Top Section */}
        <div className="footer-top">
          {/* 🔸 Logo & Mission */}
          <div className="footer-about">
            <a href="/" className="logo-link">
              <img src={logo} alt="Logo" className="footer-logo" />
              <span className="footer-brand">Blood Donation</span>
            </a>
            <p>We are dedicated to saving lives by connecting donors with those in need. Every drop counts!</p>
          </div>

          {/* 🔸 Quick Links */}
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/donate">Donate Blood</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          {/* 🔸 Contact Info */}
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <p><FaPhoneAlt /> +123 456 7890</p>
            <p><FaEnvelope /> info@blooddonation.com</p>
            <p><FaMapMarkerAlt /> 123 Donation St, City, Country</p>
          </div>

          {/* 🔸 Social Media */}
          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="https://www.facebook.com/profile.php?id=100086506817142"><FaFacebookF /></a>
              <a href="https://github.com/sayograi24"> <FaGithub /></a>
              <a href="https://www.instagram.com/sayog_rai2/"><FaInstagram /></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Blood Donation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
