"use client";
import React, { useEffect, useState } from "react";
import RecipesResult from "@/components/RecipesResult";
import { getRecipes } from "@/api/recipe";
const Recipes = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recipeCardData, setRecipeCardData] = useState([]);
  useEffect(() => {
    const fetchRecipes = async () => {
      const fetchData = await getRecipes(1, 10);
      setRecipeCardData(fetchData?.content);
    };
    fetchRecipes().then(() => setIsLoading(false));
  }, []);

  const handleSearch = (e) => {
    e?.key === "Enter" && setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 2000);
  };

  return (
    <div className="py-10">
      <div className="mx-auto max-w-[600px] mb-5">
        <h3 className="font-semibold text-normal p-2">
          What are you craving for today?
        </h3>
        <input
          type="text"
          placeholder="Search recipes..."
          className="border p-2 w-full rounded-full "
          onKeyDownCapture={handleSearch}
        />
      </div>

      <div className="border-t-2">
        {!isLoading ? (
          <RecipesResult
            isSearching={isSearching}
            recipeCardData={recipeCardData}
          />
        ) : (
          <div className="mx-auto text-center mt-40">
            <p> Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes;
