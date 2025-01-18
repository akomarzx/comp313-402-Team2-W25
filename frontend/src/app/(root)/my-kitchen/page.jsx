"use client";
import React from "react";
import RecipeCard from "@/components/RecipeCard";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
const MyKitchen = () => {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!user) {
    redirect("/");
  }
  const favoriteRecipes = [];
  const myRecipes = [];
  return (
    <div>
      <button className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded">
        <a href="/recipe/create">New Recipe</a>
      </button>
      <div>
        <fieldset className="border m-2 border-gray-200 rounded-lg p-4">
          <legend>
            <h2 className="font-semibold">MY FAVOURITE RECIPES</h2>
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:px-4 py-4  mx-auto max-w-[1200px]">
            {favoriteRecipes.map((recipe, index) => (
              <RecipeCard key={index} data={recipe} />
            ))}
          </div>
        </fieldset>
      </div>
      <div>
        <fieldset className="border m-2 border-gray-200 rounded-lg p-4">
          <legend>
            <h2 className="font-semibold">MY RECIPIES</h2>
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:px-4 py-4  mx-auto max-w-[1200px]">
            {myRecipes.map((recipe, index) => (
              <RecipeCard key={index} data={recipe} />
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
};

export default MyKitchen;
