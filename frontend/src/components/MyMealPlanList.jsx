import React from "react";

const MyMealPlanList = ({ list }) => {
  console.log(list);
  return (
    <div className="container mx-auto p-4">
      {list?.map((mealPlan) => (
        <div
          key={mealPlan.id}
          className="meal-section bg-white shadow-md rounded-lg p-6 mb-4 hover:shadow-lg transition duration-300"
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
