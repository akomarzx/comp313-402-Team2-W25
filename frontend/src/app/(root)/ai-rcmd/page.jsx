"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import IngredientInput from "@/components/IngredientInput";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  ChefHat,
  Sparkles,
  UtensilsCrossed,
  Apple,
  Calendar,
  LoaderIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";

const AIReccommend = () => {
  const [ingredients, setIngredients] = useState([]);
  const [dietary, setDietary] = useState("");
  const [allergies, setAllergies] = useState([]);
  const [mealPlanDays, setMealPlanDays] = useState("7");
  const [mealPlanGoal, setMealPlanGoal] = useState("");
  const [caloriesGoal, setCaloriesGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, login, loading } = useAuth();

  const handleGenerateMealPlan = async () => {
    if (ingredients.length === 0) {
      toast.error("Please add at least one ingredient");
      return;
    }
    setIsLoading(true);
    const requestBody = {
      ingredients,
      dietary,
      allergies,
      mealPlanDays,
      mealPlanGoal,
      caloriesGoal,
    };
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
    } else {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        router.push(
          `/ai-rcmd/meal-plan?data=${encodeURIComponent(
            JSON.stringify(requestBody)
          )}`
        );
      } catch (error) {
        console.log(error);
        toast.error("Failed to generate meal plan");
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleGenerateRecipes = async () => {
    if (ingredients.length < 3) {
      toast.error("Please add at least three ingredient");
      return;
    }

    setIsLoading(true);
    const requestBody = {
      ingredients,
      dietary,
      allergies,
    };
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
    } else {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        router.push(
          `/ai-rcmd/recipe?data=${encodeURIComponent(
            JSON.stringify(requestBody)
          )}`
        );
      } catch (error) {
        console.log(error);
        toast.error("Failed to generate recipes");
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    <div className="min-h-screen fade-in">
      <div className="container max-w-4xl mx-auto px-4 py-12 md:py-20">
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
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-8 border border-purple-100">
          <Tabs defaultValue="recipes" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="recipes" className="text-base">
                Single Recipe
              </TabsTrigger>
              <TabsTrigger value="mealplan" className="text-base">
                Meal Plan
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recipes" className="space-y-8">
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-800">
                  What ingredients do you have?
                </label>
                <IngredientInput
                  ingredients={ingredients}
                  setIngredients={setIngredients}
                />
              </div>

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
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setAllergies([...allergies, allergy]);
                            } else {
                              setAllergies(
                                allergies.filter((a) => a !== allergy)
                              );
                            }
                          }}
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

              <Button
                className="w-full bg-gradient-to-r from-green-600 to-blue-300  hover:to-yellow-200 text-white py-6 text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl rounded-xl"
                onClick={handleGenerateRecipes}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Creating your recipes...</span>
                  </div>
                ) : (
                  "Generate Recipes"
                )}
              </Button>
            </TabsContent>

            <TabsContent value="mealplan" className="space-y-8">
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-800">
                  Meal Plan Duration
                </label>
                <Select value={mealPlanDays} onValueChange={setMealPlanDays}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select number of days" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Days</SelectItem>
                    <SelectItem value="5">5 Days</SelectItem>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="14">14 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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

              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-800">
                  Daily Calorie Goal
                </label>
                <Input
                  type="number"
                  placeholder="Enter your daily calorie goal"
                  value={caloriesGoal}
                  onChange={(e) => setCaloriesGoal(e.target.value)}
                  min="1000"
                  max="5000"
                  className="w-full"
                />
              </div>

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
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setAllergies([...allergies, allergy]);
                            } else {
                              setAllergies(
                                allergies.filter((a) => a !== allergy)
                              );
                            }
                          }}
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

              <Button
                className="w-full bg-gradient-to-r from-green-600 to-blue-300  hover:to-yellow-200 text-white py-6 text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl rounded-xl"
                onClick={handleGenerateMealPlan}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
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
export default AIReccommend;
