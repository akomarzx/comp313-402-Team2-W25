"use client";
import React from "react";
import RecipeCard from "@/components/RecipeCard";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LoaderIcon } from "lucide-react";
const MyCookBook = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  if (loading) return <LoaderIcon className="animate-spin m-auto" />;
  if (!user) {
    router.push("/");
  }
  const favoriteRecipes = [];
  const myRecipes = [];
  return (
    <div className="py-10 px-6">
      <h2 className="mx-2 font-bold text-2xl ">MY COOK BOOK</h2>
      <div className="text-right">
        <button
          onClick={() => router.push("/recipe/create")}
          className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 mx-2 rounded"
        >
          New Recipe
        </button>
      </div>

      <div>
        <fieldset className="border mx-2 my-5 border-gray-200 rounded-lg p-4">
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
    </div>
  );
};

export default MyCookBook;
