"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { redirect } from "next/navigation";
import axios from "axios";

// Create authentication context
const AuthContext = createContext();
const bffUrl = process.env.NEXT_PUBLIC_NODE_API;

// AuthProvider component: provides authentication state and actions to its children
export const AuthProvider = ({ children }) => {
  // State for user authentication and loading status
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cached data for categories and top recipes, with last update timestamp
  const [categories, setCategories] = useState(null);
  const [topRecipes, setTopRecipes] = useState(null);

  // Initiate login by redirecting to the backend login endpoint
  const login = async (currentUrl = "") => {
    try {
      localStorage.setItem("lastUrl", currentUrl);
      window.location.assign(`${bffUrl}/login`);

      setLoading(true);
      // Wait for redirection and then fetch session after a delay
      setTimeout(async () => {
        await fetchSession();
        setLoading(false);
      }, 5000);

      if (user) {
        redirect("/");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  // Log out the user via backend endpoint and clear user state
  const logout = async () => {
    try {
      await axios.get(`${bffUrl}/logout`, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Retrieve current session and update user state
  const fetchSession = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${bffUrl}/session`, {
        withCredentials: true,
      });
      setUser(response.data.authenticated ? response.data.user : null);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories from the backend and cache the result with a timestamp
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
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch top recipes from the backend and cache the result with a timestamp
  const fetchTopRecipes = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_RECIPE_API}/kc/v1/public/top-recipe`
      );
      if (response.data) {
        setTopRecipes({
          data: response.data.result,
          lastUpdated: Date.now(),
        });
        console.log("Top recipes fetched:", response.data.result);
      }
    } catch (error) {
      console.error("Error fetching top recipes:", error);
    }
  };

  // On initial component load, fetch session, categories, and top recipes
  useEffect(() => {
    if (!user) fetchSession();

    // Fetch categories if not present or if cache is older than 1 day
    if (!categories) {
      fetchCategories();
    } else {
      const oneDay = 24 * 60 * 60 * 1000;
      if (Date.now() - categories.lastUpdated > oneDay) {
        fetchCategories();
      }
    }

    // Fetch top recipes if not present or if cache is older than 7 days
    if (!topRecipes) {
      fetchTopRecipes();
    } else {
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - topRecipes.lastUpdated > sevenDays) {
        fetchTopRecipes();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        fetchSession,
        categories,
        topRecipes,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access AuthContext
export const useAuth = () => useContext(AuthContext);
