import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user?.role || user.role !== "admin") {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default PrivateRoute;
