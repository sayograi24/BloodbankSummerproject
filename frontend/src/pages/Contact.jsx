import React, { useState } from "react";
import "./Contact.css";
import { FaFacebookF, FaGithub, FaInstagram, FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaQuestionCircle } from "react-icons/fa";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      console.log("Form submitted:", formData);
      setSubmitted(true);
      setLoading(false);
      setFormData({ name: "", email: "", message: "" });
    }, 2000); // Simulate a delay
  };

  return (
    <div className="contact">
      <h2>Contact Us</h2>

      {/* 🔥 Contact Details */}
      <div className="contact-details">
        <p><FaPhoneAlt /> <a href="tel:+123456789">+123 456 7890</a></p>
        <p><FaEnvelope /> <a href="mailto:sayograi24@gmail.com">sayograi24@gmail.com</a></p>
        <p><FaMapMarkerAlt />Katipur college of management and information technology</p>
      </div>

      {/* 🔥 Contact Form & Map Side by Side */}
      <div className="contact-container">
        {/* Contact Form (Right Side) */}
        <div className="contact-form">
          {submitted ? (
            <p className="success-message">Thank you for your message! We'll get back to you soon.</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Write your message here"
                ></textarea>
              </div>
              <button type="submit" className="submit-button">
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>

        {/* Google Map (Left Side) */}
        <div className="map-container">
          <h3>Find Us Here</h3>
          <iframe
            title="Google Map"
            className="google-map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.605254694831!2d85.3381266!3d27.698505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb199bc3725273%3A0x2237abfde1ac9646!2sKantipur%20College%20of%20Management%20and%20Information%20Technology!5e0!3m2!1sen!2s!4v1709300000000!5m2!1sen!2s"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* 🔥 Working Hours */}
      <div className="working-hours">
        <h3><FaClock /> Working Hours</h3>
        <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
        <p>Saturday: 10:00 AM - 4:00 PM</p>
        <p>Sunday: Closed</p>
      </div>

      {/* 🔥 Frequently Asked Questions */}
      <div className="faq">
        <h3><FaQuestionCircle /> FAQs</h3>
        <p><strong>Q:</strong> Can I donate blood if I have a cold?</p>
        <p><strong>A:</strong> It's best to wait until you're fully recovered before donating.</p>
        <p><strong>Q:</strong> How often can I donate blood?</p>
        <p><strong>A:</strong> Every 8 weeks for whole blood donation.</p>
      </div>

      {/* 🔥 Social Media Links */}
      <div className="social-media">
        <h3>Follow Us</h3>
        <div className="social-icons">
          <a href="https://www.facebook.com/profile.php?id=100086506817142" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
          <a href="https://github.com/sayograi24" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
          <a href="https://www.instagram.com/sayog_rai2/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
        </div>
      </div>

      {/* 🔥 WhatsApp Chat Button */}
      <a href="https://wa.me/123456789" className="whatsapp-button" target="_blank" rel="noopener noreferrer">
        <FaWhatsapp className="whatsapp-icon" /> Chat with Us
      </a>
    </div>
  );
}

export default Contact;
