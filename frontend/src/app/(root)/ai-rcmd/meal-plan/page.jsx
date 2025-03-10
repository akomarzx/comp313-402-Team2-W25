"use client";

import React, { useState, useEffect, useRef } from "react";
import { redirect, useSearchParams, useRouter } from "next/navigation";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import { generateMealPlan } from "@/api/recipe";
import { ChefHat } from "lucide-react";

/**
 * AIMealplan component
 *
 * This component generates an AI-based meal plan by fetching data from the API,
 * and then it routes the user to the appropriate meal plan page.
 */
const AIMealplan = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Prevent multiple executions of certain effect
  const hasRun = useRef(false);

  // State to show loader progress
  const [isQuerying, setIsQuerying] = useState(true);

  // Set up progress count animation using motion library
  const count = useMotionValue(0);
  const rounded = useTransform(() => Math.round(count.get()));

  useEffect(() => {
    // Animate the progress count to 99 in 180 seconds
    const controls = animate(count, 99, { duration: 180 });
    return () => controls.stop();
  }, [count]);

  // Redirect unauthenticated users to home page
  if (!user) {
    redirect("/");
  }

  useEffect(() => {
    // Parse the search query data if available
    const data = JSON.parse(searchParams.get("data") || "{}");

    const request = {
      numberOfWeeks: data.mealPlanDays / 7,
      mealPreferences: [data.dietary, data.caloriesGoal + " cal"],
      allergiesAndRestrictions: data.allergies,
      goalOrPurpose: data.mealPlanGoal,
    };

    // Immediately route to reset the URL
    router.replace("/ai-rcmd/meal-plan");

    // Log request payload for debugging
    console.log(request);

    if (data && !hasRun.current) {
      hasRun.current = true;
      const fetchAIRecipe = async () => {
        try {
          // Generate meal plan through the API
          const res = await generateMealPlan(request);
          if (res) {
            console.log(res);
            // Redirect user to the generated meal plan page
            router.replace(`/cook-book/meal-plan/${res.data.result.id}`);
          }
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
    <div>
      {isQuerying && (
        <div className="mx-auto pt-40">
          <div className="mt-10 text-center mx-auto font-semibold text-xl text-gray-800">
            <p>
              Our AI Nutrition Expert is planning your meals, please wait...
            </p>
            <span className="flex items-center mx-auto justify-center">
              <motion.pre>{rounded}</motion.pre> <span>%</span>
            </span>
          </div>
          <ChefHat className="shake h-20 w-20 text-green-500 mx-auto" />
        </div>
      )}
    </div>
  );
};

export default AIMealplan;
