"use client";
// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

import axios from "axios";
// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to log in
  const login = async () => {
    window.location.href = "https://ronaldjro.dev/bff/login";
  };

  // Function to log out
  const logout = async () => {
    try {
      const res = await axios.get("https://ronaldjro.dev/bff/logout", {
        withCredentials: true,
      });
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  const fetchSession = async () => {
    try {
      const response = await axios.get("https://ronaldjro.dev/bff/session", {
        withCredentials: true,
      });
      if (response.data.authenticated) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching session:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  // Check if user is logged in on initial load
  useEffect(() => {
    fetchSession();
  }, []);

  // Provide the authentication state and actions
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to Access AuthContext
export const useAuth = () => useContext(AuthContext);
