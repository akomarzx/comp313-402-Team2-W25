"use client";
import React, { useState, useEffect } from "react";
import RecipeCard from "@/components/RecipeCard";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LoaderIcon } from "lucide-react";
import { getMyRecipes, getSavedRecipes } from "@/api/recipe";
import RecipesResult from "@/components/RecipesResult";
const MyCookBook = () => {
  const { user, loading } = useAuth();
  const [myRecipes, setMyRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [recipePage, setRecipePage] = useState(1);

  const [savedRecipePage, setSavedRecipePage] = useState(1);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [isLoading2, setIsLoading2] = useState(true);

  const fetchMyRecipes = async () => {
    const data = await getMyRecipes(recipePage);
    console.log(data);
    setMyRecipes((prev) => [...prev, ...data.content]);
    setRecipePage((prev) => prev + 1);
  };
  const fetchSavedRecipes = async () => {
    const data2 = await getSavedRecipes(savedRecipePage);
    console.log(data2);
    setSavedRecipes((prev) => [...prev, ...data2.content]);
    setSavedRecipePage((prev) => prev + 1);
  };
  async function firstFetch() {
    const data = await getMyRecipes(0);
    console.log(data);
    setMyRecipes(data.content);
    setIsLoading(false);
  }

  async function secondFetch() {
    const data2 = await getSavedRecipes(0);
    console.log(data2);
    setSavedRecipes(data2?.content);
    setIsLoading2(false);
  }
  useEffect(() => {
    console.log("fetching recipes");

    firstFetch();
    secondFetch();
  }, []);

  if (loading) return <LoaderIcon className="animate-spin m-auto" />;
  if (!user) {
    router.push("/");
  }
  const favoriteRecipes = [];
  return (
    <div className="py-10 px-6">
      <h2 className="mx-2 font-bold text-2xl ">MY COOK BOOK</h2>
      <div className="text-right">
        <button
          onClick={() => router.replace("/cook-book/create")}
          className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 mx-2 rounded"
        >
          New Recipe
        </button>
      </div>

      <div>
        <fieldset className="border mx-2 my-5 border-gray-200 rounded-lg p-4">
          <legend>
            <h2 className="font-semibold">MY RECIPES</h2>
          </legend>
          {isLoading && <LoaderIcon className="animate-spin m-auto" />}
          <div className=" mx-auto max-w-[1200px]">
            <RecipesResult recipeCardData={myRecipes} version={2} />
          </div>
          <div className="text-center mt-4">
            {myRecipes?.length >= 10 && (
              <button
                onClick={() => {
                  fetchMyRecipes();
                }}
                className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
              >
                Load More Recipes
              </button>
            )}
          </div>
        </fieldset>
      </div>
      <div>
        <fieldset className="border m-2 border-gray-200 rounded-lg p-4">
          <legend>
            <h2 className="font-semibold">MY FAVOURITE RECIPES</h2>
          </legend>
          {isLoading2 && <LoaderIcon className="animate-spin m-auto" />}
          <div className=" mx-auto max-w-[1200px]">
            <RecipesResult recipeCardData={savedRecipes} version={2} />
          </div>
          <div className="text-center mt-4">
            {savedRecipes?.length >= 10 && (
              <button
                onClick={() => {
                  fetchSavedRecipes();
                }}
                className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
              >
                Load More Recipes
              </button>
            )}
          </div>
        </fieldset>
      </div>
    </div>
  );
};

export default MyCookBook;
