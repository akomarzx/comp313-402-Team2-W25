"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LoaderIcon, MinusCircle, PlusCircle } from "lucide-react";
import { getMealPlans, getMyRecipes, getSavedRecipes } from "@/api/recipe";
import RecipesResult from "@/components/RecipesResult";
import MyMealPlanList from "@/components/MyMealPlanList";
const MyCookBook = () => {
  const { user, loading } = useAuth();
  const [myRecipes, setMyRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);

  const [recipePage, setRecipePage] = useState(1);
  const [savedRecipePage, setSavedRecipePage] = useState(1);
  const [mealPlanPage, setMealPlanPage] = useState(1);

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);
  const [isLoading3, setIsLoading3] = useState(true);

  const [isMyRecipeCollapse, setIsMyRecipeCollapse] = useState(false);
  const [isFavoriteCollapse, setIsFavoriteCollapse] = useState(false);
  const [isMealPlanCollapse, setIsMealPlanCollapse] = useState(false);

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

  const fetchMealPlans = async () => {
    const data3 = await getMealPlans(mealPlanPage);
    console.log(data3);
    setMealPlans((prev) => [...prev, ...data3.content]);
    setMealPlanPage((prev) => prev + 1);
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

  async function thirdFetch() {
    const data3 = await getMealPlans(0);
    console.log(data3);
    setMealPlans(data3?.content);
    setIsLoading3(false);
  }

  useEffect(() => {
    console.log("fetching recipes");

    firstFetch();
    secondFetch();
    thirdFetch();
  }, []);

  if (loading) return <LoaderIcon className="animate-spin m-auto" />;
  if (!user) {
    router.push("/");
  }

  return (
    <div className="min-h-screen py-10 px-6 max-w-[1200px] mx-auto bg-white">
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
        <fieldset
          className={`${
            isMyRecipeCollapse ? "max-h-[10px]" : "max-h-[1000px]"
          } overflow-hidden transition-all duration-300 ease-in-out border mx-2 my-5 border-gray-200 rounded-lg p-4`}
        >
          <legend onClick={() => setIsMyRecipeCollapse((prev) => !prev)}>
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
            <RecipesResult recipeCardData={myRecipes} version={2} />{" "}
            <div className="text-center mt-4">
              {myRecipes?.length >= 12 && (
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
          </div>
        </fieldset>
      </div>
      <div>
        <fieldset
          className={`${
            isFavoriteCollapse ? "max-h-[10px]" : "max-h-[1000px]"
          }  overflow-hidden transition-all duration-300 ease-in-out border mx-2 my-5 border-gray-200 rounded-lg p-4`}
        >
          <legend onClick={() => setIsFavoriteCollapse((prev) => !prev)}>
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
                  onClick={() => {
                    fetchSavedRecipes();
                  }}
                  className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
                >
                  Load More Recipes
                </button>
              )}
            </div>
          </div>
        </fieldset>
      </div>

      <div>
        <fieldset
          className={`${
            isMealPlanCollapse ? "max-h-[10px]" : "max-h-[1000px]"
          } overflow-hidden transition-all duration-300 ease-in-out border mx-2 my-5 border-gray-200 rounded-lg p-4`}
        >
          <legend
            onClick={() => setIsMealPlanCollapse((prev) => !prev)}
            className="flex font-semibold"
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
                  onClick={() => {
                    fetchMealPlans();
                  }}
                  className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
                >
                  Load More Recipes
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
