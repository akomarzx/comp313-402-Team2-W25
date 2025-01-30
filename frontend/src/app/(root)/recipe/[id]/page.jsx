"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getRecipeById } from "@/api/recipe";
import { RotateLoader } from "react-spinners";
import DisplayRecipe from "@/components/DisplayRecipe";
import { redirect } from "next/navigation";
const Recipe = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  if (id !== NaN) {
    redirect("/recipes");
  }
  useEffect(() => {
    const fetchRecipe = async () => {
      const data = await getRecipeById(id);
      setRecipe(data);
      console.log(data);
    };
    fetchRecipe().then(() => setIsLoading(false));
  }, [id]);
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {!isLoading ? (
        <DisplayRecipe recipe={recipe} />
      ) : (
        <div className="text-center mt-40">
          <RotateLoader />
        </div>
      )}
    </div>
  );
};

export default Recipe;
