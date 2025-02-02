"use client";
import React, { useState, useEffect, use } from "react";
import { useParams } from "next/navigation";
import { getRecipeById } from "@/api/recipe";
import { RotateLoader } from "react-spinners";
import DisplayRecipe from "@/components/DisplayRecipe";
import { redirect } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Recipe = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const { user, fetchSession } = useAuth();
  const [canUpdate, setCanUpdate] = useState(false);
  if (isNaN(id)) {
    redirect("/recipes");
  }
  useEffect(() => {
    fetchSession();
  }, []);
  useEffect(() => {
    const fetchRecipe = async () => {
      const data = await getRecipeById(id);
      setRecipe(data);
    };
    fetchRecipe().then(() => setIsLoading(false));
    if (user?.email === recipe?.createdBy) {
      setCanUpdate(true);
    }
  }, [id, user]);
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {!isLoading ? (
        <DisplayRecipe recipe={recipe} updateButton={canUpdate} />
      ) : (
        <div className="text-center mt-40">
          <RotateLoader />
        </div>
      )}
    </div>
  );
};

export default Recipe;
