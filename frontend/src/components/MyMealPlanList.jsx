import { useRouter } from "next/navigation";
import React from "react";

const MyMealPlanList = ({ list }) => {
  const router = useRouter();
  return (
    <div className="container mx-auto p-4 ">
      {list?.map((mealPlan) => (
        <div
          onClick={() => router.push(`/cook-book/meal-plan/${mealPlan.id}`)}
          key={mealPlan.id}
          className="cursor-pointer meal-section bg-white shadow-md rounded-lg p-6 mb-4 hover:shadow-lg transition duration-300"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
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
