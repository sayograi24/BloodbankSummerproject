import { Navigate } from "react-router-dom";

function ProtectedAdminRoute({ children }) {
  const adminToken = localStorage.getItem("adminToken");

  return adminToken ? children : <Navigate to="/admin/login" />;
}

export default ProtectedAdminRoute;
