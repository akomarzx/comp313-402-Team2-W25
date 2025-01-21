"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
const Profile = () => {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!user) {
    redirect("/");
  }
  return (
    <div className="py-10 h-screen align-middle">
      <h2 className="text-2xl font-semibold">Profile</h2>
      <label htmlFor="name">Name: </label>
      <h1>{user?.name || "Name not available"}</h1>
      <label htmlFor="email">Email: </label>
      <p>{user?.email || "Email not available"}</p>
    </div>
  );
};

export default Profile;
