import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DonateBlood.css";

function DonateBlood() {
  const [donation, setDonation] = useState({
    name: "",
    address: "",
    phone: "",
    bloodGroup: "",
    appointmentTime: ""
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, [token, navigate]);

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
        address: "",
        phone: "",
        bloodGroup: "",
        appointmentTime: ""
      });
    } catch (error) {
      setMessage(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="donate-container">
      <h2 className="form-title">Blood Donation Form</h2>
      <form onSubmit={handleSubmit} className="donate-form">
        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required value={donation.name} />
        <input type="text" name="address" placeholder="Address" onChange={handleChange} required value={donation.address} />
        <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} required value={donation.phone} />
        
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
  );
}

export default DonateBlood;
