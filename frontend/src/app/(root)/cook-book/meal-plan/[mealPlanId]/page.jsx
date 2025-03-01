"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { LoaderIcon } from "lucide-react";
import { getMealPlanById } from "@/api/recipe";
import MealPlan from "@/components/MealPlan";

const MyMealPlan = () => {
  const { mealPlanId } = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mealPlan, setMealPlan] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const fetchMealPlan = async () => {
    const data = await getMealPlanById(mealPlanId);
    setMealPlan(data);
    console.log(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMealPlan();
  }, []);

  if (loading) return <LoaderIcon className="animate-spin m-auto" />;
  if (!user) {
    router.push("/");
  }

  return (
    <div className="min-h-screen py-10 px-6 max-w-[1200px] mx-auto bg-white">
      {isLoading ? (
        <LoaderIcon className="animate-spin m-auto" />
      ) : (
        <div>
          {mealPlan && (
            <div>
              <MealPlan mealPlanData={mealPlan} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyMealPlan;
