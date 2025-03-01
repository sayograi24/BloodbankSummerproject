    import React, { useState, useEffect } from "react";
    import axios from "axios";
    import { useNavigate } from "react-router-dom";
    import {
    FaTint,
    FaUser,
    FaSignOutAlt,
    FaBars,
    FaTrash,
    FaEdit,
    FaQuoteLeft,
    } from "react-icons/fa";
    import "./AdminDashboard.css";

    function AdminDashboard() {
    const navigate = useNavigate();
    const [donors, setDonors] = useState([]);
    const [users, setUsers] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedTab, setSelectedTab] = useState("donors");

    // Donor State
    const [donorData, setDonorData] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "",
        bloodGroup: "",
        address: "",
    });
    const [editingDonor, setEditingDonor] = useState(null);

    // User State (Kept unchanged)
    const [userData, setUserData] = useState({
        name: "",
        email: "",
    });
    const [editingUser, setEditingUser] = useState(null);

    const [testimonialData, setTestimonialData] = useState({
        name: "",
        message: "",
    });

    // Fetch data on component load
    useEffect(() => {
        fetchData();
        fetchTestimonials();

    }, []);

    // ✅ Fetch Donors and Users
    const fetchData = async () => {
        try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            navigate("/admin/login");
            return;
        }

        const [donorsRes, usersRes] = await Promise.all([
            axios.get("http://localhost:5000/donors", {
            headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("http://localhost:5000/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
            }),
        ]);

        // ✅ Fix: Ensure donors data is correctly set
        setDonors(donorsRes.data?.donors || []);
        setUsers(usersRes.data?.users || []);
        } catch (error) {
        console.error("Error fetching data:", error.response?.data || error);
        }
    };

    

        // ✅ Fetch Testimonials
        const fetchTestimonials = async () => {
            try {
                const res = await axios.get("http://localhost:5000/testimonials");
                setTestimonials(res.data.testimonials || []);
            } catch (error) {
                console.error("Error fetching testimonials:", error.response?.data || error);
            }
        };
    
        // ✅ Handle Testimonial Input Change
        const handleTestimonialChange = (e) => {
            setTestimonialData({ ...testimonialData, [e.target.name]: e.target.value });
        };
    
        // ✅ Add Testimonial
        const handleAddTestimonial = async (e) => {
            e.preventDefault();
            try {
                const token = localStorage.getItem("adminToken");
                await axios.post("http://localhost:5000/admin/testimonials/add", testimonialData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                setTestimonialData({ name: "", message: "" });
                fetchTestimonials();
            } catch (error) {
                console.error("Error adding testimonial:", error.response?.data || error);
            }
        };
    
        // ✅ Delete Testimonial
        const handleDeleteTestimonial = async (name) => {
            try {
                const token = localStorage.getItem("adminToken");
                await axios.delete(`http://localhost:5000/admin/testimonials/delete/${name}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                setTestimonials(testimonials.filter((t) => t.name !== name));
            } catch (error) {
                console.error("Error deleting testimonial:", error.response?.data || error);
            }
        };
    

    // ✅ Handle Donor Input Changes
    const handleChange = (e) => {
        setDonorData({ ...donorData, [e.target.name]: e.target.value });
    };

    const handleEditUser = (user) => {
        console.log("Editing user:", user); // ✅ Debugging: Check if user data is correct
    
        if (!user || !user.name || !user.email) {
            console.error("Invalid user data:", user);
            return;
        }
    
        setUserData({
            name: user.name || "",  // ✅ Prevent undefined values
            email: user.email || "" // ✅ Prevent undefined values
        });
    
        setEditingUser(user);  // ✅ Now, the form should show correctly
    };
    
    const handleUserChange = (e) => {
        setUserData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };
    


    // ✅ Update User (Fix Applied)
    const handleUpdateUser = async (e) => {
        e.preventDefault();
        if (!editingUser) return;

        try {
        const token = localStorage.getItem("adminToken");
        await axios.put(
            `http://localhost:5000/admin/users/edit/${editingUser.email}`,
            userData,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        setEditingUser(null);
        setUserData({ name: "", email: "" });
        fetchData(); // Refresh Users
        } catch (error) {
        console.error("Error updating user:", error.response?.data || error);
        }
    };

    // ✅ Delete User (Fix Applied)
    const handleDeleteUser = async (email) => {
        if (!email) return;

        try {
        const token = localStorage.getItem("adminToken");
        await axios.delete(`http://localhost:5000/admin/users/delete/${email}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        // Remove user from state immediately for better UX
        setUsers(users.filter(user => user.email !== email));
        } catch (error) {
        console.error("Error deleting user:", error.response?.data || error);
        }
    };

    // ✅ Add or Update Donor
    const handleSubmitDonor = async (e) => {
        e.preventDefault();
        try {
        const token = localStorage.getItem("adminToken");

        if (editingDonor) {
            await axios.put(
            `http://localhost:5000/admin/donors/edit/${editingDonor.email}`,
            donorData,
            { headers: { Authorization: `Bearer ${token}` } }
            );
            setEditingDonor(null);
        } else {
            await axios.post("http://localhost:5000/admin/donors/add", donorData, {
            headers: { Authorization: `Bearer ${token}` },
            });
        }

        setDonorData({ name: "", email: "", phone: "", gender: "", bloodGroup: "", address: "" });
        fetchData();
        } catch (error) {
        console.error("Error updating donor:", error.response?.data || error);
        }
    };

    // ✅ Edit Donor
    const handleEditDonor = (donor) => {
        setDonorData({ ...donor });
        setEditingDonor(donor);
    };

    // ✅ Delete Donor
    const handleDeleteDonor = async (email) => {
        try {
        const token = localStorage.getItem("adminToken");
        await axios.delete(`http://localhost:5000/admin/donors/delete/${email}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchData();
        } catch (error) {
        console.error("Error deleting donor:", error.response?.data || error);
        }
    };

    // ✅ Logout
    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
    };

    return (
        <div className="admin-dashboard">
        <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
            <div className="logo">Blood Bank Admin</div>
            <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars />
            </button>
            <ul>
            <li onClick={() => setSelectedTab("donors")}><FaTint /> Donors</li>
            <li onClick={() => setSelectedTab("users")}><FaUser /> Users</li>
            <li onClick={() => setSelectedTab("testimonials")}><FaQuoteLeft /> Testimonials</li>
            <li onClick={handleLogout}><FaSignOutAlt /> Logout</li>
            </ul>
        </div>

        <div className="content">
            {selectedTab === "donors" && (
            <>
                <h2>Donor Management</h2>
                <form onSubmit={handleSubmitDonor}>
                <input type="text" name="name" placeholder="Name" value={donorData.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={donorData.email} onChange={handleChange} required disabled={editingDonor} />
                <input type="text" name="phone" placeholder="Phone" value={donorData.phone} onChange={handleChange} required />
                <select name="gender" value={donorData.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                <select name="bloodGroup" value={donorData.bloodGroup} onChange={handleChange} required>
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
                <input type="text" name="address" placeholder="Address" value={donorData.address} onChange={handleChange} required />
                <button type="submit">{editingDonor ? "Update Donor" : "Add Donor"}</button>
                </form>

                <table>
                <thead>
                    <tr><th>Name</th><th>Email</th><th>Phone</th><th>Blood Group</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {donors.length > 0 ? (
                    donors.map((donor, index) => (
                        <tr key={index}>
                        <td>{donor.name}</td>
                        <td>{donor.email}</td>
                        <td>{donor.phone}</td>
                        <td>{donor.bloodGroup}</td>
                        <td>
                            <button className="edit" onClick={() => handleEditDonor(donor)}><FaEdit /></button>
                            <button className="delete" onClick={() => handleDeleteDonor(donor.email)}><FaTrash /></button>
                        </td>
                        </tr>
                    ))
                    ) : (
                    <tr><td colSpan="5">No donors found.</td></tr>
                    )}
                </tbody>
                </table>
            </>
            )}

            {selectedTab === "users" && (
            <>
                {/* ✅ Ensure the form displays only when editingUser is set */}
                {editingUser && userData.name !== undefined && (
                    <form onSubmit={handleUpdateUser} className="edit-form">
                        <h3>Edit User</h3>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={userData.name || ""}
                            onChange={handleUserChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={userData.email || ""}
                            readOnly
                        />
                        <button type="submit">Update User</button>
                        <button type="button" onClick={() => setEditingUser(null)}>Cancel</button>
                    </form>
                )}



                <table>
                <thead>
                    <tr><th>Name</th><th>Email</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                    <tr key={index}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                        <button className="edit" onClick={() => handleEditUser(user)}><FaEdit /></button>
                        <button className="delete" onClick={() => handleDeleteUser(user.email)}><FaTrash /></button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </>
            )}

             {/* ✅ Testimonials Management */}
             {selectedTab === "testimonials" && (
                    <>
                        <h2>Manage Testimonials</h2>

                        <form onSubmit={handleAddTestimonial} className="testimonial-form">
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={testimonialData.name}
                                onChange={handleTestimonialChange}
                                required
                            />
                            <textarea
                                name="message"
                                placeholder="Your Testimonial"
                                value={testimonialData.message}
                                onChange={handleTestimonialChange}
                                required
                            />
                            <button type="submit">Add Testimonial</button>
                        </form>

                        {/* ✅ Testimonials Table */}
                        <table>
                            <thead>
                                <tr><th>Name</th><th>Message</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {testimonials.length > 0 ? (
                                    testimonials.map((testimonial, index) => (
                                        <tr key={index}>
                                            <td>{testimonial.name}</td>
                                            <td>{testimonial.message}</td>
                                            <td>
                                                <button className="delete" onClick={() => handleDeleteTestimonial(testimonial.name)}>
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="3">No testimonials found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </>
                )}
        </div>
        </div>
    );
    }

    export default AdminDashboard;
