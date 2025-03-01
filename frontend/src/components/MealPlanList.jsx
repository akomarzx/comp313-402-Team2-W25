import React, { useEffect, useState } from "react";
import MealPlanRecipe from "./MealPlanRecipe";

const MealPlanList = ({ recipes }) => {
  const mealTypes = ["Breakfast", "Lunch", "Dinner"];
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (recipes) {
      setLoading(false);
    }
  }, [recipes]);
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 animate-fade-in">
      <div className="space-y-8">
        {recipes?.map((meal, index) => (
          <div key={index} className="meal-section">
            <div className="flex items-center mb-2">
              <div className="w-24  font-medium">{mealTypes[index % 3]}</div>
              <div className="h-px flex-1 "></div>
            </div>
            <MealPlanRecipe recipe={meal} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlanList;
