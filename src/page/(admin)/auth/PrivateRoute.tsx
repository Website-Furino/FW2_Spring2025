import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user?.role || user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
