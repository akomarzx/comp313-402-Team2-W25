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
  ArrowRight,
  Lightbulb,
  Brain,
  Database,
  Zap,
  Leaf,
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
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 via-gray-50 to-emerald-50/30 relative py-12">
      {/* Decorative elements for tech/AI feeling */}
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

      {/* Subtle tech circuit pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03] z-0">
        <div className="absolute left-0 top-0 w-full h-full rotate-12">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-green-700 w-full"
              style={{ top: `${i * 20}%` }}
            />
          ))}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-px bg-green-700 h-full"
              style={{ left: `${i * 12.5}%` }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 mb-5 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm rounded-full border border-green-100">
            <Leaf className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3 relative inline-block">
            AI Recipe Recommendations
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get personalized recipes and meal plans based on your ingredients,
            dietary preferences, and goals
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-sm overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/20 via-transparent to-emerald-50/20 opacity-70 pointer-events-none" />

          <Tabs defaultValue="recipes" className="w-full relative z-10">
            {/* Tab Navigation */}
            <div className="border-b border-gray-100">
              <TabsList className="w-full flex rounded-none bg-transparent border-b overflow-hidden">
                <TabsTrigger
                  value="recipes"
                  className="flex-1 py-4 data-[state=active]:shadow-none data-[state=active]:bg-white/80 data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 text-gray-600 data-[state=active]:text-emerald-700 rounded-none"
                >
                  <span className="flex items-center gap-2">
                    <ChefHat className="w-4 h-4" />
                    <span>Single Recipe</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="mealplan"
                  className="flex-1 py-4 data-[state=active]:shadow-none data-[state=active]:bg-white/80 data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 text-gray-600 data-[state=active]:text-emerald-700 rounded-none"
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Meal Plan</span>
                  </span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Recipes Tab Content */}
            <TabsContent value="recipes" className="p-6 focus:outline-none">
              <div className="space-y-6">
                {/* Ingredients Section */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-emerald-500" />
                    What ingredients do you have?
                  </label>
                  <IngredientInput
                    ingredients={ingredients}
                    setIngredients={setIngredients}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Add at least 3 ingredients to generate recipes
                  </p>
                </div>

                {/* Dietary Preferences */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Apple className="w-3.5 h-3.5 text-emerald-500" />
                    Dietary Preferences
                  </label>
                  <Select value={dietary} onValueChange={setDietary}>
                    <SelectTrigger className="border border-gray-200 bg-white/80 backdrop-blur-sm">
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
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-500" />
                    Allergies & Restrictions
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-1 bg-green-50/80 p-3 rounded-lg border border-green-100">
                    {["Nuts", "Dairy", "Eggs", "Soy", "Wheat", "Shellfish"].map(
                      (allergy) => (
                        <div
                          key={allergy}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={allergy}
                            checked={allergies.includes(allergy)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(allergy, checked)
                            }
                            className="border-green-200 text-emerald-600 focus:ring-emerald-500"
                          />
                          <label
                            htmlFor={allergy}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {allergy}
                          </label>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white py-2 transition-colors mt-4 shadow-sm"
                  onClick={handleGenerateRecipes}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      <span>Generating recipes...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Recipe</span>
                      <span className="bg-emerald-500/20 rounded-full text-xs py-0.5 px-2 ml-1 text-white">
                        AI
                      </span>
                    </div>
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* Meal Plan Tab Content */}
            <TabsContent value="mealplan" className="p-6 focus:outline-none">
              <div className="space-y-6">
                <div className="text-sm text-gray-600 mb-2 bg-gradient-to-r from-green-50 to-emerald-50/60 p-3 rounded-md border border-green-100/50 shadow-sm">
                  <p className="flex items-center">
                    <Brain className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                    <span>
                      A fully customized meal plan with 3 meals per day for 7
                      days
                    </span>
                  </p>
                </div>

                {/* Goal / Purpose Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-emerald-500" />
                    Goal / Purpose
                  </label>
                  <Select value={mealPlanGoal} onValueChange={setMealPlanGoal}>
                    <SelectTrigger className="border border-gray-200 bg-white/80 backdrop-blur-sm">
                      <SelectValue placeholder="Select your goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight-loss">Weight Loss</SelectItem>
                      <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="health">General Health</SelectItem>
                      <SelectItem value="energy">
                        Energy & Performance
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Daily Calorie Goal Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    Daily Calorie Goal
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter your daily calorie goal"
                    value={caloriesGoal}
                    onChange={(e) => setCaloriesGoal(e.target.value)}
                    min={1000}
                    max={5000}
                    className="border border-gray-200 bg-white/80 backdrop-blur-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended range: 1,000 - 5,000 calories
                  </p>
                </div>

                {/* Dietary Preferences for Meal Plan */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Apple className="w-3.5 h-3.5 text-emerald-500" />
                    Dietary Preferences
                  </label>
                  <Select value={dietary} onValueChange={setDietary}>
                    <SelectTrigger className="border border-gray-200 bg-white/80 backdrop-blur-sm">
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
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-500" />
                    Allergies & Restrictions
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-1 bg-green-50/80 p-3 rounded-lg border border-green-100">
                    {["Nuts", "Dairy", "Eggs", "Soy", "Wheat", "Shellfish"].map(
                      (allergy) => (
                        <div
                          key={allergy}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`mealplan-${allergy}`}
                            checked={allergies.includes(allergy)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(allergy, checked)
                            }
                            className="border-green-200 text-emerald-600 focus:ring-emerald-500"
                          />
                          <label
                            htmlFor={`mealplan-${allergy}`}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {allergy}
                          </label>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white py-2 transition-colors mt-4 shadow-sm"
                  onClick={handleGenerateMealPlan}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      <span>Generating meal plan...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Generate Meal Plan</span>
                      <span className="bg-emerald-500/20 rounded-full text-xs py-0.5 px-2 ml-1 text-white">
                        AI
                      </span>
                    </div>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Features Section */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-lg p-5 text-center relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="mx-auto w-12 h-12 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 rounded-full mb-3 shadow-sm border border-green-100 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-800 mb-1">
                AI-Powered
              </h3>
              <p className="text-xs text-gray-600">
                Using advanced AI to create personalized recipes
              </p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-lg p-5 text-center relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="mx-auto w-12 h-12 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 rounded-full mb-3 shadow-sm border border-green-100 group-hover:scale-110 transition-transform">
                <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-800 mb-1">
                Personalized
              </h3>
              <p className="text-xs text-gray-600">
                Tailored to your preferences and dietary needs
              </p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-lg p-5 text-center relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="mx-auto w-12 h-12 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 rounded-full mb-3 shadow-sm border border-green-100 group-hover:scale-110 transition-transform">
                <Leaf className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-800 mb-1">
                Nutrition-Focused
              </h3>
              <p className="text-xs text-gray-600">
                Balanced recipes that support your health goals
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommend;
