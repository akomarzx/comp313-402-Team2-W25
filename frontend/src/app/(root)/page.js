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
    <div>
      <h1>React OAuth BFF</h1>
      {user ? (
        <>
          <p>Welcome, {user.name || "User"}!</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <p>Please log in to access protected content.</p>
          <button onClick={handleLogin}>Login</button>
        </>
      )}
    </div>
  );
};

export default Home;
