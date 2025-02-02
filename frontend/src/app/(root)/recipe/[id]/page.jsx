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
  const { loading, user, fetchSession } = useAuth();
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
    if (!loading) fetchRecipe().then(() => setIsLoading(false));
  }, [id, user]);
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {!isLoading ? (
        <DisplayRecipe
          recipe={recipe}
          updateButton={user?.email === recipe?.createdBy}
        />
      ) : (
        <div className="text-center mt-40">
          <RotateLoader />
        </div>
      )}
    </div>
  );
};

export default Recipe;
