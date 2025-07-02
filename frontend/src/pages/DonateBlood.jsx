import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DonateBlood.css";

function DonateBlood() {
  const [donation, setDonation] = useState({
    name: "",
    age: "",
    gender: "",
    address: "",
    phone: "",
    bloodGroup: "",
    appointmentTime: "",
  });

  const [message, setMessage] = useState("");
  const [recentDonors, setRecentDonors] = useState([]); 
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, [token, navigate]);

  //  Fetch recent donors from database
  useEffect(() => {
    const fetchRecentDonors = async () => {
      try {
        const res = await axios.get("http://localhost:5000/donors");
        setRecentDonors(res.data.donors.slice(0, 5)); // Get only the latest 5 donors
      } catch (error) {
        console.error("Error fetching donors:", error);
      }
    };

    fetchRecentDonors();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setDonation({ ...donation, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/donate", donation, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.message);
      setDonation({
        name: "",
        age: "",
        gender: "",
        address: "",
        phone: "",
        bloodGroup: "",
        appointmentTime: "",
      });

      //  Refresh donors list after successful donation
      const donorsRes = await axios.get("http://localhost:5000/donors");
      setRecentDonors(donorsRes.data.donors.slice(0, 5));
      
    } catch (error) {
      setMessage(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="donate-page">
      {/* Left Sidebar */}
      <div className="left-sidebar">
        <h3>Why Donate Blood?</h3>
        <ul>
          <li>Saves lives and improves health</li>
          <li>Boosts your cardiovascular health</li>
          <li>Helps maintain healthy iron levels</li>
          <li>Reduces harmful stored iron in the body</li>
        </ul>
      </div>

      {/* Main Form Section */}
      <div className="donate-container">
        <h2 className="form-title">Blood Donation Form</h2>
        <form onSubmit={handleSubmit} className="donate-form">
          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required value={donation.name} />
          <input type="number" name="age" placeholder="Age" onChange={handleChange} required value={donation.age} min="18" max="65" />
          
          {/* Gender Selection */}
          <div className="gender-container">
            <label>
              <input type="radio" name="gender" value="Male" onChange={handleChange} required checked={donation.gender === "Male"} />
              Male
            </label>
            <label>
              <input type="radio" name="gender" value="Female" onChange={handleChange} required checked={donation.gender === "Female"} />
              Female
            </label>
          </div>

          <input type="text" name="address" placeholder="Address" onChange={handleChange} required value={donation.address} />
          <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} required value={donation.phone} pattern="[0-9]{10}" />

          <select name="bloodGroup" onChange={handleChange} required value={donation.bloodGroup}>
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>

          <input type="datetime-local" name="appointmentTime" onChange={handleChange} required value={donation.appointmentTime} />
          <button type="submit" className="donate-button">Submit</button>
        </form>

        {message && <p className="form-message">{message}</p>}
      </div>

      {/* Right Sidebar - Recent Donors */}
      <div className="right-sidebar">
        <h3>Recent Donors</h3>
        {recentDonors.length > 0 ? (
          <ul>
            {recentDonors.map((donor, index) => (
              <li key={index}>
                <strong>{donor.name}</strong> - {donor.bloodGroup} <br />
                <small>{donor.address}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No donors available</p>
        )}
      </div>
    </div>
  );
}

export default DonateBlood;
