import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DonorList() {
  const [donors, setDonors] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/signin"); // Redirect if not logged in
      return;
    }

    const fetchDonors = async () => {
      try {
        const res = await axios.get("http://localhost:5000/donors", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDonors(res.data.donors);
      } catch (error) {
        setMessage(error.response?.data?.error || "Failed to fetch donors");
      }
    };

    fetchDonors();
  }, [token, navigate]);

  return (
    <div className="donor-container">
      <h2>Registered Blood Donors</h2>

      {message && <p>{message}</p>}

      {donors.length > 0 ? (
        <table border="1">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Blood Group</th>
              <th>Appointment Time</th>
            </tr>
          </thead>
          <tbody>
            {donors.map((donor, index) => (
              <tr key={index}>
                <td>{donor.name}</td>
                <td>{donor.address}</td>
                <td>{donor.phone}</td>
                <td>{donor.bloodGroup}</td>
                <td>{new Date(donor.appointmentTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No donors have registered yet.</p>
      )}
    </div>
  );
}

export default DonorList;
