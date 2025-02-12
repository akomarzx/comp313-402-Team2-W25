"use client";
import React, { useState, useEffect, use } from "react";
import { useParams } from "next/navigation";
import { getRatingById, getRecipeById } from "@/api/recipe";
import { RotateLoader } from "react-spinners";
import DisplayRecipe from "@/components/DisplayRecipe";
import { redirect } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Recipe = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [rating, setRating] = useState(null);
  const { loading, user } = useAuth();
  if (isNaN(id)) {
    redirect("/recipes");
  }
  const fetchRecipe = async () => {
    setIsLoading(true);
    const data = await getRecipeById(id);
    const data2 = await getRatingById(id, user !== null);

    if (data && data2) {
      setIsLoading(false);
    }

    setRecipe(data);
    setRating(data2);
  };
  useEffect(() => {
    if (!loading) fetchRecipe();
  }, []);
  useEffect(() => {
    if (!loading) {
      fetchRecipe();
    }
  }, [id, user]);
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {!isLoading ? (
        <DisplayRecipe
          recipe={recipe}
          ratingCurrent={{ ...rating, user: user }}
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
