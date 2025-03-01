import React from "react";
import MealPlanRecipe from "./MealPlanRecipe";

const MealPlanList = ({ recipes }) => {
  const mealTypes = ["Breakfast", "Lunch", "Dinner"];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 animate-fade-in">
      {recipes.length > 0 ? (
        <div className="space-y-8">
          {recipes.map((recipe, index) => (
            <div key={recipe.id} className="meal-section">
              <div className="flex items-center mb-2">
                <div className="w-24  font-medium">{mealTypes[index % 3]}</div>
                <div className="h-px flex-1 "></div>
              </div>
              <MealPlanRecipe recipe={recipe} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16  rounded-lg border ">
          <p className="">
            No recipes found. Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default MealPlanList;
