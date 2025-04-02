"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  LoaderIcon,
  PlusCircle,
  BookOpen,
  Heart,
  Utensils,
} from "lucide-react";
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

  // Total count
  const [totalCount, setTotalCount] = useState(0);
  const [totalCount2, setTotalCount2] = useState(0);
  const [totalCount3, setTotalCount3] = useState(0);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);
  const [isLoading3, setIsLoading3] = useState(true);

  // Collapse states
  const [isMyRecipeCollapse, setIsMyRecipeCollapse] = useState(false);
  const [isFavoriteCollapse, setIsFavoriteCollapse] = useState(true);
  const [isMealPlanCollapse, setIsMealPlanCollapse] = useState(true);

  // Fetch user-created recipes (paginated)
  const fetchMyRecipes = async () => {
    const data = await getMyRecipes(recipePage);
    console.log(totalCount);
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
    setTotalCount(data.page.totalElements);
    setMyRecipes(data.content);
    setIsLoading(false);
  }

  // Initial fetch for favorite recipes
  async function secondFetch() {
    const data2 = await getSavedRecipes(0);
    setTotalCount2(data2.page.totalElements);
    setSavedRecipes(data2?.content);
    setIsLoading2(false);
  }

  // Initial fetch for meal plans
  async function thirdFetch() {
    const data3 = await getMealPlans(0);
    setTotalCount3(data3.page.totalElements);
    setMealPlans(data3?.content);
    setIsLoading3(false);
  }

  // On mount
  useEffect(() => {
    if (!user && !loading) router.push("/");
    firstFetch();
    secondFetch();
    thirdFetch();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderIcon className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">My Cookbook</h1>
          <button
            onClick={() => router.replace("/cook-book/create")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <PlusCircle size={18} />
            <span>Create Recipe</span>
          </button>
        </div>

        {/* My recipes */}
        <div className="mb-6 bg-white border border-gray-100 rounded-lg overflow-hidden">
          <button
            className="w-full flex justify-between items-center p-4 font-medium text-left text-gray-800 hover:bg-gray-50 transition-colors focus:outline-none"
            onClick={() => setIsMyRecipeCollapse((prev) => !prev)}
          >
            <div className="flex items-center gap-2 over">
              <Utensils size={18} className="text-blue-600" />
              <span>My Recipes</span>
              {myRecipes.length > 0 && totalCount > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                  {myRecipes.length} of {totalCount}
                </span>
              )}
            </div>
            {isMyRecipeCollapse ? (
              <ChevronRight size={18} className="text-gray-500" />
            ) : (
              <ChevronDown size={18} className="text-gray-500" />
            )}
          </button>

          <div
            className={`transition-all duration-300 overflow-scroll ${
              isMyRecipeCollapse
                ? "max-h-0"
                : "max-h-[1000px] border-t border-gray-100 "
            }`}
          >
            <div className="p-4">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <LoaderIcon className="animate-spin h-6 w-6 text-blue-500" />
                </div>
              ) : myRecipes.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <p>You haven't created any recipes yet.</p>
                </div>
              ) : (
                <>
                  <RecipesResult recipeCardData={myRecipes} version={2} />
                  {myRecipes?.length < totalCount && (
                    <div className="text-center mt-6">
                      <button
                        onClick={fetchMyRecipes}
                        className="bg-white text-blue-600 hover:bg-blue-50 border border-blue-200 font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        Load More
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Favorite recipes */}
        <div className="mb-6 bg-white border border-gray-100 rounded-lg overflow-hidden">
          <button
            className="w-full flex justify-between items-center p-4 font-medium text-left text-gray-800 hover:bg-gray-50 transition-colors focus:outline-none"
            onClick={() => setIsFavoriteCollapse((prev) => !prev)}
          >
            <div className="flex items-center gap-2">
              <Heart size={18} className="text-red-500" />
              <span>Favorite Recipes</span>
              {savedRecipes.length > 0 && totalCount2 > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                  {savedRecipes.length} of {totalCount2}
                </span>
              )}
            </div>
            {isFavoriteCollapse ? (
              <ChevronRight size={18} className="text-gray-500" />
            ) : (
              <ChevronDown size={18} className="text-gray-500" />
            )}
          </button>

          <div
            className={`transition-all duration-300 overflow-scroll ${
              isFavoriteCollapse
                ? "max-h-0"
                : "max-h-[2000px] border-t border-gray-100"
            }`}
          >
            <div className="p-4">
              {isLoading2 ? (
                <div className="flex justify-center py-10">
                  <LoaderIcon className="animate-spin h-6 w-6 text-blue-500" />
                </div>
              ) : savedRecipes.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <p>You haven't saved any favorite recipes yet.</p>
                </div>
              ) : (
                <>
                  <RecipesResult recipeCardData={savedRecipes} version={2} />
                  {savedRecipes?.length < totalCount2 && (
                    <div className="text-center mt-6">
                      <button
                        onClick={fetchSavedRecipes}
                        className="bg-white text-blue-600 hover:bg-blue-50 border border-blue-200 font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        Load More
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Meal plans */}
        <div className="mb-6 bg-white border border-gray-100 rounded-lg overflow-hidden">
          <button
            className="w-full flex justify-between items-center p-4 font-medium text-left text-gray-800 hover:bg-gray-50 transition-colors focus:outline-none"
            onClick={() => setIsMealPlanCollapse((prev) => !prev)}
          >
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-green-600" />
              <span>Meal Plans</span>
              {mealPlans.length > 0 && totalCount3 > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                  {mealPlans.length} of {totalCount3}
                </span>
              )}
            </div>
            {isMealPlanCollapse ? (
              <ChevronRight size={18} className="text-gray-500" />
            ) : (
              <ChevronDown size={18} className="text-gray-500" />
            )}
          </button>

          <div
            className={`transition-all duration-300 overflow-scroll ${
              isMealPlanCollapse
                ? "max-h-0"
                : "max-h-[2000px] border-t border-gray-100"
            }`}
          >
            <div className="p-4">
              {isLoading3 ? (
                <div className="flex justify-center py-10">
                  <LoaderIcon className="animate-spin h-6 w-6 text-blue-500" />
                </div>
              ) : mealPlans.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <p>You haven't created any meal plans yet.</p>
                </div>
              ) : (
                <>
                  <MyMealPlanList list={mealPlans} />
                  {mealPlans?.length < totalCount3 && (
                    <div className="text-center mt-6">
                      <button
                        onClick={fetchMealPlans}
                        className="bg-white text-blue-600 hover:bg-blue-50 border border-blue-200 font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        Load More
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCookBook;
