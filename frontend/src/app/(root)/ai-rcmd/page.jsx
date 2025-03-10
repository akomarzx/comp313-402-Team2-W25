"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import IngredientInput from "@/components/IngredientInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChefHat,
  Sparkles,
  UtensilsCrossed,
  Apple,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const AIRecommend = () => {
  // State definitions
  const [ingredients, setIngredients] = useState([]);
  const [dietary, setDietary] = useState("none");
  const [allergies, setAllergies] = useState([]);
  const [mealPlanGoal, setMealPlanGoal] = useState("");
  const [caloriesGoal, setCaloriesGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, login } = useAuth();

  // Validate and generate meal plan request
  const handleGenerateMealPlan = async () => {
    // Validate daily calorie goal
    if (caloriesGoal) {
      if (caloriesGoal < 1000) {
        toast.error("Daily calorie goal must be at least 1000");
        return;
      }
      if (caloriesGoal > 5000) {
        toast.error("Daily calorie goal should be at most 5000");
        return;
      }
    }
    setIsLoading(true);

    const requestBody = {
      dietary,
      allergies,
      mealPlanGoal,
      caloriesGoal,
    };

    // User not logged in? prompt for login and redirect
    if (!user) {
      toast.error("Please login to generate meal plan");
      setIsLoading(false);
      setTimeout(() => {
        login(
          `/ai-rcmd/meal-plan?data=${encodeURIComponent(
            JSON.stringify(requestBody)
          )}`
        );
      }, 1500);
      return;
    }

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push(
        `/ai-rcmd/meal-plan?data=${encodeURIComponent(
          JSON.stringify(requestBody)
        )}`
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate meal plan");
    } finally {
      setIsLoading(false);
    }
  };

  // Validate and generate recipe request
  const handleGenerateRecipes = async () => {
    // Validate minimum ingredients requirement
    if (ingredients.length < 3) {
      toast.error("Please add at least three ingredients");
      return;
    }
    setIsLoading(true);

    const requestBody = {
      ingredients,
      dietary,
      allergies,
    };

    // User not logged in? prompt for login and redirect
    if (!user) {
      toast.error("Please login to generate recipes");
      setIsLoading(false);
      setTimeout(() => {
        login(
          `/ai-rcmd/recipe?data=${encodeURIComponent(
            JSON.stringify(requestBody)
          )}`
        );
      }, 1500);
      return;
    }

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push(
        `/ai-rcmd/recipe?data=${encodeURIComponent(
          JSON.stringify(requestBody)
        )}`
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate recipes");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle allergy status in array
  const handleCheckboxChange = (allergy, checked) => {
    if (checked) {
      setAllergies((prev) => [...prev, allergy]);
    } else {
      setAllergies((prev) => prev.filter((a) => a !== allergy));
    }
  };

  return (
    <div className="min-h-screen fade-in">
      {/* Main Container */}
      <div className="container max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <div className="relative inline-flex">
            <div className="relative bg-white shadow-xl rounded-full p-6">
              <ChefHat className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 to-blue-300 text-transparent bg-clip-text tracking-tight">
            AI Recipe Recommendation
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Transform your ingredients into culinary masterpieces with our
            AI-powered recipe generator
          </p>
          <div className="flex items-center justify-center gap-8 text-gray-600">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-500" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-green-500" />
              <span>Personalized</span>
            </div>
            <div className="flex items-center gap-2">
              <Apple className="w-5 h-5 text-green-500" />
              <span>Dietary-Friendly</span>
            </div>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-8 border border-purple-100">
          <Tabs defaultValue="recipes" className="w-full">
            {/* Tabs List */}
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="recipes" className="text-base">
                Single Recipe
              </TabsTrigger>
              <TabsTrigger value="mealplan" className="text-base">
                Meal Plan
              </TabsTrigger>
            </TabsList>

            {/* Recipes Tab Content */}
            <TabsContent value="recipes" className="space-y-8">
              {/* Ingredients Section */}
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-800">
                  What ingredients do you have?
                </label>
                <IngredientInput
                  ingredients={ingredients}
                  setIngredients={setIngredients}
                />
              </div>

              {/* Dietary Preferences */}
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-800">
                  Dietary Preferences
                </label>
                <Select value={dietary} onValueChange={setDietary}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select dietary preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Preference</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="pescatarian">Pescatarian</SelectItem>
                    <SelectItem value="keto">Keto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Allergies & Restrictions */}
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-800">
                  Allergies & Restrictions
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {["Nuts", "Dairy", "Eggs", "Soy", "Wheat", "Shellfish"].map(
                    (allergy) => (
                      <div
                        key={allergy}
                        className="flex items-center space-x-3"
                      >
                        <Checkbox
                          id={allergy}
                          checked={allergies.includes(allergy)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(allergy, checked)
                          }
                          className="border-2 border-purple-200 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                        />
                        <label
                          htmlFor={allergy}
                          className="text-gray-700 font-medium cursor-pointer select-none"
                        >
                          {allergy}
                        </label>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Generate Recipe Button */}
              <Button
                className="w-full bg-gradient-to-r from-green-600 to-blue-300 hover:to-yellow-200 text-white py-6 text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl rounded-xl"
                onClick={handleGenerateRecipes}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>Creating your recipes...</span>
                  </div>
                ) : (
                  "Generate Recipes"
                )}
              </Button>
            </TabsContent>

            {/* Meal Plan Tab Content */}
            <TabsContent value="mealplan" className="space-y-8">
              {/* Meal Plan Description */}
              <div className="space-y-4">
                {/* <label className="block text-lg font-semibold text-gray-800">
                  Meal Plan Duration
                </label>
                <Select value={mealPlanDays} onValueChange={setMealPlanDays}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select number of days" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="14">14 Days</SelectItem>
                    <SelectItem value="21">21 Days</SelectItem>
                    <SelectItem value="28">28 Days</SelectItem>
                  </SelectContent>
                </Select> */}
                <p className="text-lg text-center font-semibold text-gray-800">
                  A fully customized 3 meals - 7 days tailored to your need
                </p>
              </div>

              {/* Goal / Purpose Selection */}
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-800">
                  Goal / Purpose
                </label>
                <Select value={mealPlanGoal} onValueChange={setMealPlanGoal}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight-loss">Weight Loss</SelectItem>
                    <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="health">General Health</SelectItem>
                    <SelectItem value="energy">Energy & Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Daily Calorie Goal Input */}
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-800">
                  Daily Calorie Goal
                </label>
                <Input
                  type="number"
                  placeholder="Enter your daily calorie goal"
                  value={caloriesGoal}
                  onChange={(e) => setCaloriesGoal(e.target.value)}
                  min={1000}
                  max={5000}
                  className="w-full"
                />
              </div>

              {/* Dietary Preferences for Meal Plan */}
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-800">
                  Dietary Preferences
                </label>
                <Select value={dietary} onValueChange={setDietary}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select dietary preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Preference</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="pescatarian">Pescatarian</SelectItem>
                    <SelectItem value="keto">Keto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Allergies & Restrictions for Meal Plan */}
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-800">
                  Allergies & Restrictions
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {["Nuts", "Dairy", "Eggs", "Soy", "Wheat", "Shellfish"].map(
                    (allergy) => (
                      <div
                        key={allergy}
                        className="flex items-center space-x-3"
                      >
                        <Checkbox
                          id={`mealplan-${allergy}`}
                          checked={allergies.includes(allergy)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(allergy, checked)
                          }
                          className="border-2 border-purple-200 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                        />
                        <label
                          htmlFor={`mealplan-${allergy}`}
                          className="text-gray-700 font-medium cursor-pointer select-none"
                        >
                          {allergy}
                        </label>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Generate Meal Plan Button */}
              <Button
                className="w-full bg-gradient-to-r from-green-600 to-blue-300 hover:to-yellow-200 text-white py-6 text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl rounded-xl"
                onClick={handleGenerateMealPlan}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>Creating your meal plan...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>Generate Meal Plan</span>
                  </div>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AIRecommend;
