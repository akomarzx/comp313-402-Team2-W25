"use client";

import React, { useState, useEffect, useRef } from "react";
import { redirect, useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { generateRecipe } from "@/api/recipe";
import DisplayRecipe from "@/components/DisplayRecipe";
import { ChefHat } from "lucide-react";

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

    // Log the request payload for debugging
    console.log("Request payload:", request);

    // If there is valid data and the fetch hasn't executed yet, run the API call
    if (data && !hasRun.current) {
      hasRun.current = true;

      const fetchAIRecipe = async () => {
        try {
          const res = await generateRecipe(request);
          setRecipe(res);
          console.log("Generated recipe:", res);
        } catch (error) {
          console.error("Error fetching recipe:", error);
        } finally {
          setIsQuerying(false);
        }
      };

      fetchAIRecipe();
    }
  }, [router, searchParams]);

  return (
    <div className="py-10">
      <div>
        {isQuerying ? (
          // Loading view while the AI recipe is being generated
          <div className="mx-auto text-center mt-40">
            <p className="mb-10">
              Our AI is cooking up your recipe, please wait...
            </p>
            <ChefHat className="shake h-20 w-20 text-green-500 mx-auto" />
          </div>
        ) : recipe?.data?.result?.recipe ? (
          // Display the AI-generated recipe if available
          <DisplayRecipe
            recipe={recipe.data.result.recipe}
            saveButton={true}
            categories={categories}
          />
        ) : (
          // Inform the user that no recipe was found based on the provided preferences
          <div className="mx-auto text-center mt-40">
            <p className="mb-10">No recipes found for your preferences</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecipes;
