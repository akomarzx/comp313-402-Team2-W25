"use client";
// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Create Auth Context
const AuthContext = createContext();
const bffUrl = process.env.NEXT_PUBLIC_NODE_API;
// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Function to log in
  const login = async (currentUrl = "") => {
    localStorage.setItem("lastUrl", currentUrl);
    router.push(`${bffUrl}/login`);
  };

  // Function to log out
  const logout = async () => {
    try {
      const res = await axios.get(`${bffUrl}/logout`, {
        withCredentials: true,
      });
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const fetchSession = async () => {
    try {
      const response = await axios.get(`${bffUrl}/session`, {
        withCredentials: true,
      });
      if (response.data.authenticated) {
        console.log("User is authenticated:", response.data.user);
        setUser(response.data.user);
      } else {
        console.log("User is not authenticated");
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
    <AuthContext.Provider
      value={{ user, login, logout, loading, fetchSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to Access AuthContext
export const useAuth = () => useContext(AuthContext);
