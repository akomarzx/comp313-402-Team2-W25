import React from "react";
import { useRouter } from "next/navigation";
import { Calendar, ArrowRight, Clock } from "lucide-react";

// MyMealPlanList component displays a list of meal plans.
// Each meal plan is clickable and navigates to a detailed view.
const MyMealPlanList = ({ list }) => {
  const router = useRouter();

  // Navigate to the detailed page for the selected meal plan
  const handleMealPlanClick = (id) => {
    router.push(`/cook-book/meal-plan/${id}`);
  };

  if (!list || list.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>No meal plans found. Create your first meal plan!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {list?.map((mealPlan) => (
        <div
          key={mealPlan.id}
          onClick={() => handleMealPlanClick(mealPlan.id)}
          className="group cursor-pointer border border-gray-100 hover:border-gray-300 bg-white rounded-lg p-5 transition-all duration-200"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                {mealPlan.label}
              </h3>
              <div className="flex items-center text-xs text-gray-500 mb-1">
                <Calendar size={14} className="mr-1.5" />
                <span>
                  {new Date(mealPlan.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              {mealPlan.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {mealPlan.description}
                </p>
              )}
            </div>
            <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
              <ArrowRight size={18} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyMealPlanList;
