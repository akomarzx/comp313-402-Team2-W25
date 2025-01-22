"use client";
import React from "react";
import { useAuth } from "../../context/AuthContext";
const Home = () => {
  const { user, login, logout, loading } = useAuth();

  const handleLogin = async () => {
    await login();
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="text-center py-12">
      {user ? (
        <>
          <p className="text-xl text-gray-600">
            Welcome, {user.name || "User"}!
          </p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <p className="text-xl text-gray-600">
            Log In to access your Cook Book and AI features
          </p>
          <button
            onClick={handleLogin}
            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-700"
          >
            Login / Signup
          </button>
        </>
      )}
    </div>
  );
};

export default Home;
