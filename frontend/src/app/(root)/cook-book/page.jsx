"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LoaderIcon, MinusCircle, PlusCircle } from "lucide-react";
import { getMealPlans, getMyRecipes, getSavedRecipes } from "@/api/recipe";
import RecipesResult from "@/components/RecipesResult";
import MyMealPlanList from "@/components/MyMealPlanList";

const MyCookBook = () => {
  // Auth context
  const { user, loading } = useAuth();
  const router = useRouter();

  // Recipe data
  const [myRecipes, setMyRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);

  // Pagination
  const [recipePage, setRecipePage] = useState(1);
  const [savedRecipePage, setSavedRecipePage] = useState(1);
  const [mealPlanPage, setMealPlanPage] = useState(1);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);
  const [isLoading3, setIsLoading3] = useState(true);

  // Collapse states
  const [isMyRecipeCollapse, setIsMyRecipeCollapse] = useState(true);
  const [isFavoriteCollapse, setIsFavoriteCollapse] = useState(true);
  const [isMealPlanCollapse, setIsMealPlanCollapse] = useState(true);

  // Fetch user-created recipes (paginated)
  const fetchMyRecipes = async () => {
    const data = await getMyRecipes(recipePage);
    setMyRecipes((prev) => [...prev, ...data.content]);
    setRecipePage((prev) => prev + 1);
  };

  // Fetch favorite recipes (paginated)
  const fetchSavedRecipes = async () => {
    const data = await getSavedRecipes(savedRecipePage);
    setSavedRecipes((prev) => [...prev, ...data.content]);
    setSavedRecipePage((prev) => prev + 1);
  };

  // Fetch meal plans (paginated)
  const fetchMealPlans = async () => {
    const data = await getMealPlans(mealPlanPage);
    setMealPlans((prev) => [...prev, ...data.content]);
    setMealPlanPage((prev) => prev + 1);
  };

  // Initial fetch for recipes
  async function firstFetch() {
    const data = await getMyRecipes(0);
    setMyRecipes(data.content);
    setIsLoading(false);
  }

  // Initial fetch for favorite recipes
  async function secondFetch() {
    const data2 = await getSavedRecipes(0);
    setSavedRecipes(data2?.content);
    setIsLoading2(false);
  }

  // Initial fetch for meal plans
  async function thirdFetch() {
    const data3 = await getMealPlans(0);
    setMealPlans(data3?.content);
    setIsLoading3(false);
  }

  // On mount
  useEffect(() => {
    if (!user) router.push("/");
    firstFetch();
    secondFetch();
    thirdFetch();
  }, []);

  if (loading) return <LoaderIcon className="animate-spin m-auto" />;

  return (
    <div className="min-h-screen py-10 px-6 max-w-[1200px] mx-auto bg-white">
      <h2 className="mx-2 font-bold text-2xl">MY COOK BOOK</h2>

      {/* New recipe */}
      <div className="text-right">
        <button
          onClick={() => router.replace("/cook-book/create")}
          className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 mx-2 rounded"
        >
          New Recipe
        </button>
      </div>

      {/* My recipes */}
      <div>
        <fieldset
          className={`${
            isMyRecipeCollapse ? "h-[50px]" : "h-[800px]"
          } overflow-y-auto transition-all duration-300 ease-in-out border mx-2 my-5 border-gray-200 rounded-lg p-4`}
        >
          <legend
            className="cursor-pointer"
            onClick={() => setIsMyRecipeCollapse((prev) => !prev)}
          >
            <h2 className="flex font-semibold">
              <span>MY RECIPES</span>
              {isMyRecipeCollapse ? (
                <PlusCircle className="my-auto ml-2" size={18} />
              ) : (
                <MinusCircle className="my-auto ml-2" size={18} />
              )}
            </h2>
          </legend>
          {isLoading && <LoaderIcon className="animate-spin m-auto" />}
          <div
            className={`transition-all duration-300 mx-auto max-w-[1200px] ${
              isMyRecipeCollapse && "invisible"
            }`}
          >
            <RecipesResult recipeCardData={myRecipes} version={2} />
            <div className="text-center mt-4">
              {myRecipes?.length >= 12 && (
                <button
                  onClick={fetchMyRecipes}
                  className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
                >
                  Load More Recipes
                </button>
              )}
            </div>
          </div>
        </fieldset>
      </div>

      {/* Favorite recipes */}
      <div>
        <fieldset
          className={`${
            isFavoriteCollapse ? "h-[50px]" : "h-[800px]"
          }  overflow-y-auto transition-all duration-300 ease-in-out border mx-2 my-5 border-gray-200 rounded-lg p-4`}
        >
          <legend
            className="cursor-pointer"
            onClick={() => setIsFavoriteCollapse((prev) => !prev)}
          >
            <h2 className="flex font-semibold">
              <span>MY FAVORITE RECIPES</span>
              {isFavoriteCollapse ? (
                <PlusCircle className="my-auto ml-2" size={18} />
              ) : (
                <MinusCircle className="my-auto ml-2" size={18} />
              )}
            </h2>
          </legend>
          {isLoading2 && <LoaderIcon className="animate-spin m-auto" />}
          <div
            className={`transition-all duration-300 mx-auto max-w-[1200px]  ${
              isFavoriteCollapse && "invisible"
            }`}
          >
            <RecipesResult recipeCardData={savedRecipes} version={2} />
            <div className="text-center mt-4">
              {savedRecipes?.length >= 12 && (
                <button
                  onClick={fetchSavedRecipes}
                  className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
                >
                  Load More Recipes
                </button>
              )}
            </div>
          </div>
        </fieldset>
      </div>

      {/* Meal plans */}
      <div>
        <fieldset
          className={`${
            isMealPlanCollapse ? "h-[50px]" : "h-[800px]"
          } overflow-y-auto transition-all duration-300 ease-in-out border mx-2 my-5 border-gray-200 rounded-lg p-4`}
        >
          <legend
            onClick={() => setIsMealPlanCollapse((prev) => !prev)}
            className="flex font-semibold cursor-pointer"
          >
            <h2 className="flex font-semibold">
              <span>MY MEAL PLANS</span>
              {isMealPlanCollapse ? (
                <PlusCircle className="my-auto ml-2" size={18} />
              ) : (
                <MinusCircle className="my-auto ml-2" size={18} />
              )}
            </h2>
          </legend>
          {isLoading3 && <LoaderIcon className="animate-spin m-auto" />}
          <div
            className={`transition-all duration-300 mx-auto max-w-[1200px]  ${
              isMealPlanCollapse && "invisible"
            }`}
          >
            <MyMealPlanList list={mealPlans} />
            <div className="text-center mt-4">
              {mealPlans?.length >= 12 && (
                <button
                  onClick={fetchMealPlans}
                  className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
                >
                  Load Meal Plans
                </button>
              )}
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  );
};

export default MyCookBook;
