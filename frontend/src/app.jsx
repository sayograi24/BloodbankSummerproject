import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import DonateBlood from "./pages/DonateBlood";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import SearchDonors from "./components/SearchDonors";
import DonorsList from "./pages/DonorsList";
import Footer from "./components/Footer";
import AboutUs from "./pages/AboutUs";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin"); // 🔴 Check if it's an admin page

  return (
    <>
      {/* ✅ Hide Navbar in Admin Pages */}
      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/donate-blood" element={<DonateBlood />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<SearchDonors />} />
        <Route path="/donors/:bloodGroup" element={<DonorsList />} />
        
        {/* 🔥 Admin Routes - No Navbar & Footer */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
      </Routes>

      {/* ✅ Hide Footer in Admin Pages */}
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
