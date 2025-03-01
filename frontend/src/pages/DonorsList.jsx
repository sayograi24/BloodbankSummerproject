import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../pages/DonorsList.css"; 
import SearchDonors from "../components/SearchDonors";

const DonationList = () => {
  const { bloodGroup } = useParams(); 
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/donors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Filter donors based on selected blood group
        const filteredDonors = response.data.donors.filter(
          (donor) => donor.bloodGroup === bloodGroup
        );

        setDonors(filteredDonors);
      } catch (err) {
        setError("Error fetching donors.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, [bloodGroup]);

  return (
    <div className="donors-page">
      <SearchDonors/>
      <h2>Available Donors for Blood Group: {bloodGroup}</h2>
      {loading ? (
        <p>Loading donors...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : donors.length === 0 ? (
        <p>No donors found for {bloodGroup}.</p>
      ) : (
        <div className="donor-cards">
          {donors.map((donor, index) => (
            <div key={index} className="donor-card">
              <div className="donor-header">
                <h3 className="donor-name">{donor.name}</h3>
                <span className="donor-blood-group">{donor.bloodGroup}</span>
              </div>
              <p><strong>Gender:</strong> {donor.gender}</p>
              <p><strong>Age:</strong> {donor.age}</p>
              <p><strong>Phone:</strong> {donor.phone}</p>
              <p><strong>Location:</strong> {donor.address}</p>
              <p><strong>Donation Date:</strong> {new Date(donor.donation_date).toLocaleDateString()}</p>
              <a href={`tel:${donor.phone}`} className="call-button">Call</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationList;
