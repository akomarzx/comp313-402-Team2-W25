import React, { useEffect, useState } from "react";
import MealPlanRecipe from "./MealPlanRecipe";

// MealPlanList component renders a list of meal recipes organized by meal type.
const MealPlanList = ({ recipes }) => {
  // Define meal types for labeling each section.
  const mealTypes = ["Breakfast", "Lunch", "Dinner"];

  // State to manage loading status.
  const [loading, setLoading] = useState(true);

  // Update the loading state when recipes are received.
  useEffect(() => {
    if (recipes) {
      setLoading(false);
    }
  }, [recipes]);

  // Optional: display a loading indicator while recipes are being fetched.
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">Loading...</div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 animate-fade-in">
      <div className="space-y-8">
        {recipes.map((meal, index) => (
          <div key={index} className="meal-section">
            {/* Display the meal type label */}
            <div className="flex items-center mb-2">
              <div className="w-24 font-medium">
                {mealTypes[index % mealTypes.length]}
              </div>
              <div className="h-px flex-1"></div>
            </div>
            {/* Render the meal plan recipe */}
            <MealPlanRecipe recipe={meal} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlanList;
