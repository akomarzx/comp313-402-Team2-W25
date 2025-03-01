import React, { use, useEffect, useState } from "react";
import MealPlanList from "../components/MealPlanList";
import { Leaf } from "lucide-react";
import { getRecipeById } from "@/api/recipe";

const MealPlan = ({ preFetchPlan }) => {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [isLoading, setIsLoading] = useState(true);
  const [mealPlan, setMealPlan] = useState({});
  const [currentRecipes, setCurrentRecipes] = useState([]);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const mealPlanByDay = days.reduce((acc, day, index) => {
    const startIndex = index * 3;
    const dayRecipes = preFetchPlan?.mealPlanGroupSummaryDtoList?.slice(
      startIndex,
      startIndex + 3
    );

    const adjustedRecipes =
      dayRecipes?.length === 3
        ? dayRecipes
        : [
            ...dayRecipes,
            ...preFetchPlan.mealPlanGroupSummaryDtoList?.slice(
              0,
              3 - dayRecipes.length
            ),
          ];

    acc[day] = adjustedRecipes;
    return acc;
  }, {});

  const handleDayChange = (day) => {
    setSelectedDay(day);
  };

  const fetchRecipes = async (day) => {
    console.log("fetch");
    setIsLoading(true);
    const morningRes = await getRecipeById(
      mealPlanByDay[day][0].mealPlanDaysSummaryDtoList[0].breakfastRecipeSummary
        .id
    );
    const afternoonRes = await getRecipeById(
      mealPlanByDay[day][1].mealPlanDaysSummaryDtoList[0].lunchRecipeSummary.id
    );
    const eveningRes = await getRecipeById(
      mealPlanByDay[day][2].mealPlanDaysSummaryDtoList[0].dinnerRecipeSummary.id
    );

    if (morningRes && afternoonRes && eveningRes) {
      setMealPlan({
        ...mealPlan,
        [selectedDay]: [morningRes, afternoonRes, eveningRes],
      });
      setIsLoading(false);
      setCurrentRecipes([morningRes, afternoonRes, eveningRes]);
    }
  };
  useEffect(() => {
    console.log(mealPlanByDay);
    console.log(mealPlan);
    setIsLoading(true);
    setCurrentRecipes([]);
    if (!mealPlan[selectedDay]) fetchRecipes(selectedDay);
    else setCurrentRecipes(mealPlan[selectedDay]);
    setCurrentRecipes(mealPlan[selectedDay]);
    setIsLoading(false);
  }, [selectedDay]);

  return (
    <div className="min-h-screen w-[90%] bg-white py-10 max-w-[1920px] mx-auto">
      <div className="container mx-auto px-4 sm:px-6">
        <header className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12  rounded-full flex items-center justify-center text-white">
              <Leaf className="h-6 w-6" />
            </div>
          </div>
          <h1 className="text-4xl font-medium  mb-2">
            {preFetchPlan?.label || "Weekly Meal Plan"}
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
                className={`px-4 py-2 rounded-full transition-all duration-200 ${
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
          {isLoading ? (
            <>Loading Meal Plans...</>
          ) : (
            <MealPlanList recipes={currentRecipes || []} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MealPlan;
