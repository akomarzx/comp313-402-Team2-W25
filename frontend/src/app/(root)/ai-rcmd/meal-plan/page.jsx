"use client";

import React, { useState, useEffect, useRef } from "react";

import { redirect, useSearchParams, useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { generateMealPlan } from "@/api/recipe";
import DisplayRecipe from "@/components/DisplayRecipe";
import { ChefHat } from "lucide-react";

const AIMealplan = () => {
  const router = useRouter();
  const hasRun = useRef(false);
  const { user, categories } = useAuth();
  if (!user) {
    redirect("/");
  }
  const searchParams = useSearchParams();

  const [isQuerying, setIsQuerying] = useState(true);
  const [recipe, setRecipe] = useState(null);
  useEffect(() => {
    const data = JSON.parse(searchParams.get("data") || "{}");
    const request = {
      numberOfWeeks: data.mealPlanDays / 7,
      mealPreferences: [data.dietary, data.caloriesGoal + " cal"],
      allergiesAndRestrictions: data.allergies,
      goalOrPurpose: data.mealPlanGoal,
    };
    router.push("/ai-rcmd/meal-plan");

    console.log(request);
    if (data) {
      if (!hasRun.current) {
        hasRun.current = true;
        try {
          const fetchAIRecipe = async () => {
            const res = await generateMealPlan(request);
            setRecipe(res);
            console.log(res);
          };
          fetchAIRecipe().then(() => setIsQuerying(false));
        } catch (error) {
          console.log("Error fetching recipe:", error);
        }
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
              Our AI Nutrition Expert is planning up your meals please wait ...
            </p>
            <ChefHat className="shake h-20 w-20 text-green-500 mx-auto" />
          </div>
        ) : recipe?.data.result.recipe ? (
          <>
            <p>meal plan</p>
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

export default AIMealplan;
