import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import "../pages/Home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DonateBloodPopup from "../components/DonateBloodPopup";
import { FaTint, FaHeartbeat, FaUsers } from "react-icons/fa";

// Import Images
import image1 from "../assets/images/Freedom.png";
import image2 from "../assets/images/blooddonation.jpg";
import image3 from "../assets/images/blood-donation-nepal-programme-kathmandu-2-edited.jpg";
import image4 from "../assets/images/4thimage.jpg";

function Home() {
  const sliderRef = useRef(null);
  const [donors, setDonors] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Fetch Donors from Flask API
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from local storage
        const response = await axios.get("http://localhost:5000/donors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDonors(response.data.donors);
      } catch (error) {
        console.error("Error fetching donors:", error);
      }
    };

    fetchDonors();
  }, []);

  // Slider Settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

  return (
    <div className="home">
      {/* ✅ Slider Section */}
      <section className="intro">
        <div className="slider-container">
          {/* Left Arrow */}
          <button className="slider-nav prev-button" onClick={() => sliderRef.current.slickPrev()}>
            &#8249;
          </button>

          <Slider ref={sliderRef} {...settings}>
            {[image1, image2, image3, image4].map((src, index) => (
              <div key={index} className="intro-content">
                <div className="intro-image-text">
                  <div className="intro-image">
                    <img src={src} alt={`Slide ${index + 1}`} />
                  </div>
                  <div className="intro-text">
                    <h2>Save a Life, Donate Blood</h2>
                    <p>Join us in our mission to save lives by donating blood. Every drop counts.</p>
                    <button onClick={() => setIsPopupOpen(true)} className="cta-button">
                      Donate Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          {/* Right Arrow */}
          <button className="slider-nav next-button" onClick={() => sliderRef.current.slickNext()}>
            &#8250;
          </button>
        </div>
      </section>

      {/* ✅ Updated Why Donate Blood Section */}
      <section className="why-donate">
        <div className="container">
          <p className="section-subtitle">The Importance of Blood Donation</p>
          <h2 className="section-title">Why Donate Blood?</h2><br></br>
          <div className="benefits">
            <div className="benefit-card">
              <div className="benefit-icon-circle">
                <FaTint className="benefit-icon" />
              </div>
              <h3 className="benefit-title">Helps Save Lives</h3>
              <p>Each blood donation can save up to three lives, helping patients in emergencies.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon-circle">
                <FaHeartbeat className="benefit-icon" />
              </div>
              <h3 className="benefit-title">Health Benefits</h3>
              <p>Donating blood regularly helps regulate iron levels and lowers heart disease risks.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon-circle">
                <FaUsers className="benefit-icon" />
              </div>
              <h3 className="benefit-title">Strengthens Community</h3>
              <p>By donating blood, you contribute to a healthier and more united community.</p>
            </div>
          </div>
        </div>
      </section>


      {/* ✅ How to Donate Blood Section */}
      <section className="how-to-donate">
        <div className="container">
          <h2 className="section-title">How to Donate Blood?</h2><br></br>
          <div className="steps">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Register Online</h3>
              <p>Sign up and fill in your details.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Book an Appointment</h3>
              <p>Schedule your donation at a nearby center.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Donate Safely</h3>
              <p>Visit the center and donate blood under expert supervision.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Save Lives</h3>
              <p>Your donation helps those in need.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Updated Recent Donors Section */}
      <section className="donors-list">
        <div className="container">
          <h2 className="section-title">Recent Donors</h2>
          <div className="donor-cards">
            {donors.length > 0 ? (
              donors.map((donor, index) => (
                <div key={index} className="donor-card">
                  <img src="/assets/images/logo.jpg" alt="Donor" className="donor-image" />
                  <h3>{donor.name}</h3>
                  <p><strong>Blood Group:</strong> {donor.bloodGroup}</p>
                  <p><strong>Mobile No.:</strong> {donor.phone}</p>
                  <p><strong>Gender:</strong> {donor.gender}</p>
                  <p><strong>Age:</strong> {donor.age}</p>
                  <p><strong>Address:</strong> {donor.address}</p>
                  <p><strong>Donation Date:</strong> {new Date(donor.donation_date).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p>No donors found.</p>
            )}
          </div>
        </div>
      </section>


      {isPopupOpen && <DonateBloodPopup onClose={() => setIsPopupOpen(false)} />}
    </div>
  );
}

export default Home;
