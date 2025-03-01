import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/SearchDonors.css"; // New dedicated styles

const SearchDonors = () => {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (selectedBloodGroup) {
      navigate(`/donors/${selectedBloodGroup}`); // Redirect to DonorsList page with selected blood group
    } else {
      alert("Please select a blood group.");
    }
  };

  return (
    <div className="search-container">
      <h2>Find Blood Donors</h2>
      <div className="search-box">
        <select
          className="dropdown"
          value={selectedBloodGroup}
          onChange={(e) => setSelectedBloodGroup(e.target.value)}
        >
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
        <button className="cta-button" onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
};

export default SearchDonors;
