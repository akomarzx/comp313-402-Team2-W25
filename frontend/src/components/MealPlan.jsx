import React, { useState, useMemo } from "react";
import MealPlanList from "../components/MealPlanList";
import { Leaf } from "lucide-react";

// Component to display a weekly meal plan with days and corresponding recipes.
const MealPlan = ({ mealPlanData }) => {
  // State for the currently selected day of the week (default to Monday)
  const [selectedDay, setSelectedDay] = useState("Monday");

  // Days of the week used for the meal plan navigation buttons.
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Organize meal plan data by day.
  // This memoized value recalculates only when mealPlanData changes.
  const mealPlanByDay = useMemo(() => {
    return mealPlanData?.mealPlanGroupSummaryDtoList[0].mealPlanDaysSummaryDtoList.reduce(
      (acc, meal) => {
        const day = meal.dayOfWeekLabel;
        // Collect recipes for breakfast, lunch, and dinner
        acc[day] = [meal.breakfastRecipe, meal.lunchRecipe, meal.dinnerRecipe];
        return acc;
      },
      {}
    );
  }, [mealPlanData]);

  // Handler to update selected day when a button is clicked.
  const handleDayChange = (day) => {
    setSelectedDay(day);
  };

  return (
    <div className="min-h-screen w-full min-[600px]:w-[90%] bg-white py-10 max-w-[1920px] mx-auto">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <header className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full flex items-center justify-center text-white">
              <Leaf className="h-6 w-6" />
            </div>
          </div>
          <h1 className="text-4xl font-medium mb-2">
            {mealPlanData?.label || "Weekly Meal Plan"}
          </h1>
          <p className="max-w-xl mx-auto">
            Discover healthy and delicious recipes for your week. Three meals
            per day, perfectly planned.
          </p>
        </header>

        {/* Navigation Buttons for Day Selection */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => handleDayChange(day)}
                className={`px-4 py-2 rounded-full ${
                  selectedDay === day
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-white border text-gray-600"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Display selected day's meal plan information */}
          <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
            <h2 className="text-2xl font-medium mb-1">{selectedDay}'s Meals</h2>
            <p>
              Breakfast, lunch, and dinner recipes for{" "}
              {selectedDay.toLowerCase()}.
            </p>
          </div>

          {/* MealPlanList component to display recipes for the selected day */}
          <MealPlanList recipes={mealPlanByDay[selectedDay] || []} />
        </div>
      </div>
    </div>
  );
};

export default MealPlan;
