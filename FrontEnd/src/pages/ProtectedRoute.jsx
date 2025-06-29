// src/components/ProtectedRoute.jsx

import { Navigate, Outlet } from "react-router-dom";
import axios from "../utils/axios";
import { useState, useEffect } from "react";

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data?.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}
