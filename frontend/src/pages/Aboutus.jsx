import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AboutUs.css";
import { FaHeartbeat, FaUsers, FaTint, FaHandsHelping, FaQuoteLeft } from "react-icons/fa";
import logo from "../assets/images/logo.jpg";

function AboutUs() {
  const [testimonials, setTestimonials] = useState([]);

  // ✅ Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get("http://localhost:5000/testimonials");
        setTestimonials(res.data.testimonials);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <div className="about-us">
      {/* 🔥 Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>About Us</h1>
          <p>Empowering lives through blood donation. Join us in making a difference, one drop at a time.</p>
        </div>
      </section>

      {/* 🔥 Our Mission */}
      <section className="mission-section">
        <h2>Our Mission</h2>
        <p>We are dedicated to connecting **life-saving blood donors** with those in need, ensuring a sustainable and efficient blood supply.</p>
        <div className="mission-icons">
          <div className="mission-card"><FaHeartbeat /><h3>Saving Lives</h3><p>Every donation makes a difference.</p></div>
          <div className="mission-card"><FaUsers /><h3>Community Support</h3><p>Connecting donors and recipients.</p></div>
          <div className="mission-card"><FaTint /><h3>Safe Blood Supply</h3><p>Ensuring the availability of safe blood.</p></div>
        </div>
      </section>

      {/* 🔥 Why Choose Us? */}
      <section className="why-choose">
        <h2>Why Choose Us?</h2>
        <div className="why-cards">
          <div className="why-card"><FaHandsHelping /><h3>Trusted Organization</h3><p>We are committed to ethical and safe blood donations.</p></div>
          <div className="why-card"><FaTint /><h3>Efficient Blood Network</h3><p>Ensuring a smooth and quick donor-recipient connection.</p></div>
        </div>
      </section>

      {/* 🔥 Meet Our Team */}
      <section className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-members">
          <div className="team-card">
            <img src={logo} alt="Founder" />
            <h3>Sayog Rai</h3>
            <p>Founder & CEO</p>
          </div>
          <div className="team-card">
            <img src={logo} alt="Doctor" />
            <h3>Dr. Rijal Munankarmi</h3>
            <p>Medical Director</p>
          </div>
        </div>
      </section>

      {/* 🔥 Dynamic Testimonials Section */}
      <section className="testimonials">
        <h2>What Our Donors Say</h2>
        {testimonials.length > 0 ? (
          <div className="testimonial-container">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <FaQuoteLeft className="quote-icon" />
                <p className="testimonial-message">"{testimonial.message}"</p>
                <p className="testimonial-author">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No testimonials available.</p>
        )}
      </section>
    </div>
  );
}

export default AboutUs;
