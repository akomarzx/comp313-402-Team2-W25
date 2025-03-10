import React from "react";
import { useRouter } from "next/navigation";

// MyMealPlanList component displays a list of meal plans.
// Each meal plan is clickable and navigates to a detailed view.
const MyMealPlanList = ({ list }) => {
  const router = useRouter();

  // Navigate to the detailed page for the selected meal plan
  const handleMealPlanClick = (id) => {
    router.push(`/cook-book/meal-plan/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      {list?.map((mealPlan) => (
        <div
          key={mealPlan.id}
          onClick={() => handleMealPlanClick(mealPlan.id)}
          className="cursor-pointer meal-section bg-white shadow-md rounded-lg p-6 mb-4 hover:shadow-lg transition duration-300"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {mealPlan.label}
          </h2>
          <p className="text-gray-600 text-sm">
            Created at:{" "}
            {new Date(mealPlan.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MyMealPlanList;
