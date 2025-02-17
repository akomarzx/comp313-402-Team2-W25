"use client";
// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import axios from "axios";

// Create Auth Context
const AuthContext = createContext();
const bffUrl = process.env.NEXT_PUBLIC_NODE_API;

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState(null);
  // Function to log in
  const login = async (currentUrl = "") => {
    setLoading(true);
    localStorage.setItem("lastUrl", currentUrl);
    router.push(`${bffUrl}/login`);
    if (user) {
      redirect("/");
    }
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
      setLoading(true);
      const response = await axios.get(`${bffUrl}/session`, {
        withCredentials: true,
      });
      if (response.data.authenticated) {
        // console.log("User is authenticated:", response.data.user);
        setUser(response.data.user);
      } else {
        console.log("User is not authenticated");
        setUser(null);
      }
    } catch (error) {
      console.log("Error fetching session:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_RECIPE_API}/kc/v1/category`
      );
      if (response.data) {
        setCategories({
          data: response.data.result,
          lastUpdated: Date.now(),
        });
        // console.log("Categories fetched:", response.data.result);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  // Check if user is logged in on initial load
  useEffect(() => {
    if (!user) fetchSession();
    if (!categories) {
      fetchCategories();
    } else {
      try {
        const threeDays = 24 * 60 * 60 * 1000;
        if (Date.now() - categories.lastUpdated > threeDays) {
          fetchCategories();
        }
      } catch (error) {
        console.log("Failed to parse categories:", error);
        fetchCategories();
      }
    }
  }, []);

  // Provide the authentication state and actions
  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, fetchSession, categories }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to Access AuthContext
export const useAuth = () => useContext(AuthContext);
