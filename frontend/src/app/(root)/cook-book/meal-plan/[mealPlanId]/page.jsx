"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { LoaderIcon } from "lucide-react";
import { getMealPlanById } from "@/api/recipe";
import MealPlan from "@/components/MealPlan";

const MyMealPlan = () => {
  // Retrieve mealPlanId from the route
  const { mealPlanId } = useParams();

  // Authentication and router
  const { user, loading } = useAuth();
  const router = useRouter();

  // Local state for meal plan data and loading states
  const [mealPlan, setMealPlan] = useState();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch meal plan from server
  const fetchMealPlan = async () => {
    try {
      const data = await getMealPlanById(mealPlanId);
      setMealPlan(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchMealPlan();
  }, []);

  // Show global loading or redirect if user not found
  if (loading) return <LoaderIcon className="animate-spin m-auto" />;
  if (!user) router.push("/");

  return (
    <div className="min-h-screen py-10 px-6 max-w-[1200px] mx-auto bg-white">
      {isLoading ? (
        <LoaderIcon className="animate-spin m-auto" />
      ) : (
        mealPlan && <MealPlan mealPlanData={mealPlan} />
      )}
    </div>
  );
};

export default MyMealPlan;
