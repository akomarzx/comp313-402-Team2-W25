"use client";

import React, { useState, useEffect } from "react";

import { redirect, useSearchParams, useRouter } from "next/navigation";

import { RotateLoader } from "react-spinners";
import { useAuth } from "@/context/AuthContext";
import { generateRecipe } from "@/api/recipe";
import DisplayRecipe from "@/components/DisplayRecipe";

const AIRecipies = () => {
  const router = useRouter();
  const { user } = useAuth();
  if (!user) {
    redirect("/");
  }
  const searchParams = useSearchParams();

  const [isQuerying, setIsQuerying] = useState(true);
  const [recipe, setRecipe] = useState(null);
  useEffect(() => {
    const data = JSON.parse(searchParams.get("data") || "{}");
    const request = {
      mealPreferences: [data.dietary],
      ingredientList: data.ingredients,
      allergiesAndRestrictions: data.allergies,
    };
    router.push("/ai-rcmd/recipes");

    console.log(request);
    if (data) {
      try {
        const fetchAIRecipe = async () => {
          const res = await generateRecipe(request);
          setRecipe(res);
          console.log(res);
        };
        fetchAIRecipe().then(() => setIsQuerying(false));
      } catch (error) {
        console.log("Error fetching recipe:", error);
      }
    }
  }, []);

  return (
    <div className="py-10">
      <div>
        {searchParams && isQuerying ? (
          <div className="mx-auto text-center mt-40">
            <p className="mb-10">
              {" "}
              Our AI is cooking up your repies please wait ...
            </p>
            <RotateLoader></RotateLoader>
          </div>
        ) : recipe?.data.result.recipe ? (
          <>
            <DisplayRecipe
              recipe={recipe.data.result.recipe}
              saveButton={true}
            />
          </>
        ) : (
          <div className="mx-auto text-center mt-40">
            <p className="mb-10">No recipes found for your preferences</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecipies;
