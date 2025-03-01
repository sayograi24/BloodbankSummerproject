import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import "../pages/Home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DonateBloodPopup from "../components/DonateBloodPopup";
import SearchDonors from "../components/SearchDonors";
import { FaTint, FaHeartbeat, FaUsers, FaPhoneAlt, FaQuoteLeft } from "react-icons/fa";

// Import Images
import image1 from "../assets/images/Freedom.png";
import image2 from "../assets/images/blooddonation.jpg";
import image3 from "../assets/images/blood-donation-nepal-programme-kathmandu-2-edited.jpg";
import image4 from "../assets/images/4thimage.jpg";
import logo from "../assets/images/logo.jpg";


function Home() {
  const sliderRef = useRef(null);
  const [donors, setDonors] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Fetch Donors & Testimonials from Flask API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [donorsRes, testimonialsRes] = await Promise.all([
          axios.get("http://localhost:5000/donors", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/testimonials", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setDonors(donorsRes.data.donors);
        setTestimonials(testimonialsRes.data.testimonials);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  const slides = [
    {
      image: image1,
      title: "Save a Life, Donate Blood",
      description: "Join us in our mission to save lives by donating blood. Every drop counts.",
    },
    {
      image: image2,
      title: "Operation Update: Karnali Earthquake",
      description: "A 6.4 magnitude earthquake struck Jajarkot District on 3 November 2023 at 11:47 local time. The epicenter was located in...",
    },
    {
      image: image3,
      title: "People Co-operating",
      description: "All the people around are co-operating with the staff for donating blood for the needed people.",
    },
    {
      image: image4,
      title: "Healthy Way to Live",
      description: "Donating blood can be a useful way to live, and letting others live.",
    }
  ];

  return (
    <div className="home">

      {/* 🔥 RESTORED SLIDER - ORIGINAL DESIGN */}
      <section className="intro">
        <div className="slider-container">
          <button className="slider-nav prev-button" onClick={() => sliderRef.current.slickPrev()}>
            &#8249;
          </button>

          <Slider ref={sliderRef} {...settings}>
            {slides.map((slide, index) => (
              <div key={index} className="intro-content">
                <div className="intro-image-text">
                  <div className="intro-image">
                    <img src={slide.image} alt={`Slide ${index + 1}`} loading="lazy" />
                  </div>
                  <div className="intro-text">
                    <h2>{slide.title}</h2>
                    <p>{slide.description}</p>
                    <button onClick={() => setIsPopupOpen(true)} className="cta-button">
                      Donate Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          <button className="slider-nav next-button" onClick={() => sliderRef.current.slickNext()}>
            &#8250;
          </button>
        </div>
      </section>

      <section className="why-donate">
        <div className="container">
          <h2 className="section-title">Why Donate Blood?</h2>
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

          
      {/* 🔥 NEW DESIGN: How to Donate Blood */}
        <section className="how-to-donate">
          <div className="container">
            <h2 className="section-title">How to Donate Blood?</h2>
            <div className="steps">
              {[
                { step: 1, title: "Register Online", desc: "Sign up and fill in your details." },
                { step: 2, title: "Book an Appointment", desc: "Schedule your donation at a nearby center." },
                { step: 3, title: "Donate Safely", desc: "Visit the center and donate blood under expert supervision." },
                { step: 4, title: "Save Lives", desc: "Your donation helps those in need." },
              ].map((item) => (
                <div key={item.step} className="step-card">
                  <div className="step-icon">
                    <span>{item.step}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SearchDonors/>

        <section className="donors-list">
          <div className="container">
            <h2 className="section-title">Recent Donors</h2>
            <div className="donor-cards">
              {donors.slice(0, 3).map((donor, index) => ( // Show only 3 donors
                <div key={index} className="donor-card">
                  <div className="blood-group-circle">{donor.bloodGroup}</div>
                  <img src={logo} alt="Donor Logo" className="donor-logo" /> {/* Added Logo */}
                  <h3 className="donor-name">{donor.name}</h3>
                  <div className="donor-info">
                    <p><strong>Mobile No.:</strong> {donor.phone}</p>
                    <p><strong>Gender:</strong> {donor.gender}</p>
                    <p><strong>Age:</strong> {donor.age}</p>
                    <p><strong>Address:</strong> {donor.address}</p>
                    <p><strong>Donation Date:</strong> {new Date(donor.donation_date).toLocaleDateString()}</p>
                  </div>
                  <a href={`tel:${donor.phone}`} className="call-button">
                    <FaPhoneAlt className="call-icon" /> Call Donor
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

     {/* 🔥 TESTIMONIALS SLIDER */}
     <section className="testimonials">
        <div className="container">
          <h2 className="section-title">What Our Donors Say</h2>
          {testimonials.length > 0 ? (
            <Slider {...{
              dots: true,
              infinite: true,
              speed: 500,
              slidesToShow: 1,
              slidesToScroll: 1,
              autoplay: true,
              autoplaySpeed: 5000,
              arrows: false
            }}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-card">
                  <FaQuoteLeft className="quote-icon" />
                  <p className="testimonial-message">"{testimonial.message}"</p>
                  {/*<img
                    src={testimonial.image || "https://via.placeholder.com/80"}
                    alt="User"
                    className="testimonial-image"
                  />*/}
                  <p className="testimonial-author">- {testimonial.name}</p>
                </div>
              ))}
            </Slider>
          ) : (
            <p>No testimonials available.</p>
          )}
        </div>
      </section>

      {isPopupOpen && <DonateBloodPopup onClose={() => setIsPopupOpen(false)} />}
    </div>
  );
}

export default Home;
