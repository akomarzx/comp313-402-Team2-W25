import React, { useState, useMemo } from "react";
import MealPlanList from "../components/MealPlanList";
import { Leaf } from "lucide-react";

const MealPlan = ({ mealPlanData }) => {
  const [selectedDay, setSelectedDay] = useState("Monday");

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const mealPlanByDay = useMemo(
    () =>
      mealPlanData?.mealPlanGroupSummaryDtoList[0].mealPlanDaysSummaryDtoList.reduce(
        (acc, meal) => {
          const day = meal.dayOfWeekLabel;
          if (!acc[day]) {
            acc[day] = [];
          }
          acc[day] = [
            meal.breakfastRecipe,
            meal.lunchRecipe,
            meal.dinnerRecipe,
          ];
          return acc;
        },
        {}
      ),
    [mealPlanData]
  );
  const handleDayChange = (day) => {
    setSelectedDay(day);
  };

  return (
    <div className="min-h-screen w-full min-[600px]:w-[90%] bg-white py-10 max-w-[1920px] mx-auto">
      <div className="container mx-auto px-4 sm:px-6">
        <header className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12  rounded-full flex items-center justify-center text-white">
              <Leaf className="h-6 w-6" />
            </div>
          </div>
          <h1 className="text-4xl font-medium  mb-2">
            {mealPlanData?.label || "Weekly Meal Plan"}
          </h1>
          <p className=" max-w-xl mx-auto">
            Discover healthy and delicious recipes for your week. Three meals
            per day, perfectly planned.
          </p>
        </header>

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

          <div className="bg-white p-4 rounded-lg shadow-sm border  mb-6">
            <h2 className="text-2xl font-medium  mb-1">
              {selectedDay}'s Meals
            </h2>
            <p className="">
              Breakfast, lunch, and dinner recipes for{" "}
              {selectedDay.toLowerCase()}.
            </p>
          </div>
          <MealPlanList recipes={mealPlanByDay[selectedDay] || []} />
        </div>
      </div>
    </div>
  );
};

export default MealPlan;
