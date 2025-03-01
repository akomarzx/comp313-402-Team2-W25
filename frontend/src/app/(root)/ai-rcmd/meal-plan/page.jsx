"use client";

import React, { useState, useEffect, useRef } from "react";

import { redirect, useSearchParams, useRouter } from "next/navigation";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import { generateMealPlan } from "@/api/recipe";
import DisplayRecipe from "@/components/DisplayRecipe";
import { ChefHat } from "lucide-react";
import MealPlan from "@/components/MealPlan";

const AIMealplan = () => {
  const router = useRouter();
  const hasRun = useRef(false);

  const count = useMotionValue(0);
  const rounded = useTransform(() => Math.round(count.get()));

  useEffect(() => {
    const controls = animate(count, 99, { duration: 180 });

    return () => {
      controls.stop();
    };
  }, [count]);
  const { user, categories } = useAuth();
  if (!user) {
    redirect("/");
  }
  const searchParams = useSearchParams();

  const [isQuerying, setIsQuerying] = useState(true);
  useEffect(() => {
    const data = JSON.parse(searchParams.get("data") || "{}");
    const request = {
      numberOfWeeks: data.mealPlanDays / 7,
      mealPreferences: [data.dietary, data.caloriesGoal + " cal"],
      allergiesAndRestrictions: data.allergies,
      goalOrPurpose: data.mealPlanGoal,
    };
    router.replace("/ai-rcmd/meal-plan");

    console.log(request);
    if (data) {
      if (!hasRun.current) {
        hasRun.current = true;
        try {
          const fetchAIRecipe = async () => {
            const res = await generateMealPlan(request);
            if (res) {
              console.log(res);
              router.replace(`/cook-book/meal-plan/${res.data.result.id}`);
            }
          };
          fetchAIRecipe().then(() => setIsQuerying(false));
        } catch (error) {
          console.log("Error fetching recipe:", error);
        }
      }
    }
  }, []);

  return (
    <div className="">
      <div>
        {searchParams && isQuerying && (
          <div className="mx-auto text-center pt-40">
            <div className="mb-10 flex font-semibold text-xl text-gray-800">
              <p>
                Our AI Nutrition Expert is planning up your meals please wait
                ...
              </p>
              <span>
                <motion.pre>{rounded}</motion.pre> <span>%</span>
              </span>
            </div>
            <ChefHat className="shake h-20 w-20 text-green-500 mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AIMealplan;
