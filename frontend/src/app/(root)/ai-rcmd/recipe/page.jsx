"use client";

import React, { useState, useEffect, useRef } from "react";
import { redirect, useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { generateRecipe } from "@/api/recipe";
import DisplayRecipe from "@/components/DisplayRecipe";
import { ChefHat, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const AIRecipes = () => {
  // Set up Next.js router and authentication context
  const router = useRouter();
  const hasRun = useRef(false);
  const { user, categories } = useAuth();

  // Redirect non-authenticated users to the home page
  if (!user) {
    redirect("/");
  }

  // Retrieve URL search parameters
  const searchParams = useSearchParams();

  // States for tracking AI query status and the resulting recipe
  const [isQuerying, setIsQuerying] = useState(true);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get request data from the URL query parameters and build the request payload
    const data = JSON.parse(searchParams.get("data") || "{}");
    const request = {
      mealPreferences: [data.dietary],
      ingredientList: data.ingredients,
      allergiesAndRestrictions: data.allergies,
    };

    // Clean up URL by navigating back to the base recipe page
    router.push("/ai-rcmd/recipe");

    // If there is valid data and the fetch hasn't executed yet, run the API call
    if (data && !hasRun.current) {
      hasRun.current = true;

      const fetchAIRecipe = async () => {
        try {
          const res = await generateRecipe(request);
          setRecipe(res);
        } catch (error) {
          console.error("Error fetching recipe:", error);
          setError(
            "We couldn't generate a recipe with those ingredients. Please try again with different ingredients."
          );
        } finally {
          setIsQuerying(false);
        }
      };

      fetchAIRecipe();
    }
  }, [router, searchParams]);

  const handleBackClick = () => {
    router.push("/ai-rcmd");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 via-gray-50 to-emerald-50/30 relative">
      {/* Decorative shapes for advanced AI feeling */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-green-100/10 to-transparent rounded-bl-full opacity-70" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-teal-100/10 to-transparent rounded-tr-full opacity-60" />
      <div
        className="absolute top-1/4 left-10 w-8 h-8 rounded-full bg-emerald-100/20 animate-pulse"
        style={{ animationDuration: "4s" }}
      />
      <div
        className="absolute bottom-1/3 right-20 w-6 h-6 rounded-full bg-green-100/20 animate-pulse"
        style={{ animationDuration: "5s" }}
      />

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-6 text-gray-600 hover:text-gray-900 hover:bg-white/70 -ml-2 backdrop-blur-sm"
          onClick={handleBackClick}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to AI Recommendations
        </Button>

        {isQuerying ? (
          // Loading state
          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl p-10 text-center my-12 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-50/30 via-transparent to-emerald-50/30 opacity-70" />
            <div className="flex flex-col items-center justify-center space-y-6 relative z-10">
              <div className="relative">
                <div className="animate-pulse bg-gradient-to-r from-green-50 to-emerald-50 rounded-full w-24 h-24 flex items-center justify-center shadow-sm">
                  <ChefHat className="h-12 w-12 text-emerald-600" />
                </div>
                <div className="absolute -bottom-1 -right-1 animate-spin h-5 w-5 border-2 border-emerald-600 border-t-transparent rounded-full" />
                <div className="absolute top-0 left-0 animate-ping h-full w-full rounded-full border border-green-200 opacity-20" />
              </div>
              <h2 className="text-xl font-medium text-gray-800 mt-2">
                Generating your recipe
              </h2>
              <p className="text-gray-500 text-sm max-w-sm">
                Our AI is analyzing your ingredients and preferences to create a
                personalized recipe just for you
              </p>

              {/* Stylish loading dots */}
              <div className="flex space-x-2 justify-center">
                <div
                  className="w-2 h-2 rounded-full bg-green-400 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-teal-600 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        ) : recipe?.data?.result?.recipe ? (
          // Recipe result - Wrapped with a decorative header
          <div className="relative">
            <div className="absolute -top-4 left-0 right-0 h-20 bg-gradient-to-r from-green-100/80 via-white/90 to-emerald-100/80 rounded-t-xl blur-sm -z-10" />
            <div className="flex items-center justify-center mb-4">
              <div className="inline-flex items-center justify-center py-1 px-3 rounded-full bg-green-50 border border-green-100 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-emerald-500 mr-2" />
                <span className="text-xs font-medium text-emerald-700">
                  AI Generated Recipe
                </span>
              </div>
            </div>
            <DisplayRecipe
              recipe={recipe.data.result.recipe}
              saveButton={true}
              categories={categories}
            />
          </div>
        ) : (
          // Error or no recipe found
          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl p-10 text-center my-12 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/70 to-gray-100/50 opacity-70" />
            <div className="flex flex-col items-center justify-center space-y-4 relative z-10">
              <div className="bg-gray-50 rounded-full p-5 shadow-sm border border-gray-100">
                <ChefHat className="h-10 w-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-medium text-gray-800 mt-2">
                No Recipe Found
              </h2>
              <p className="text-gray-500 text-sm max-w-md">
                {error ||
                  "We couldn't generate a recipe based on your criteria. Try again with different ingredients or preferences."}
              </p>
              <Button
                className="mt-4 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white shadow-sm"
                onClick={handleBackClick}
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecipes;
