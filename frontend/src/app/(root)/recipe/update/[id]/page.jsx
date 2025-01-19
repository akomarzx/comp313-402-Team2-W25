"use client";
import { redirect, useParams } from "next/navigation";
import React from "react";
import { useAuth } from "@/context/AuthContext";
const UpdateRecipe = () => {
  const { user, loading } = useAuth();
  const { id } = useParams();

  if (loading) return <p>Loading...</p>;
  console.log(user);
  if (!user) {
    redirect("/");
  }
  return <div>UpdateRecipe {id}</div>;
};

export default UpdateRecipe;
