import React from "react";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Clock, ChefHat } from "lucide-react";
import { redirect } from "next/navigation";

const RecipeList = ({ recipeListData }) => {
  return (
    <div className="min-h-screen">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            className="text-gray-600"
            onClick={() => redirect("/ai-rcmd")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Your Personalized Recipes
            </h1>
            <p className="text-gray-600 mt-1">
              Based on your ingredients and preferences
            </p>
          </div>
        </div>

        <div className="space-y-8 animate-fadeIn">
          {recipeListData.map((recipe) => (
            <div
              key={recipe.id}
              className="flex items-center gap-6 border-x-[1px] bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer"
              onClick={() => navigate(`/recipe/${recipe.id}`)}
            >
              <div className="w-48 h-32 flex-shrink-0">
                <img
                  src={recipe.image || "/placeholder.svg"}
                  alt={recipe.title}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-serif text-xl font-medium mb-2">
                  {recipe.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {recipe.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.cookingTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ChefHat className="h-4 w-4" />
                    <span>{recipe.difficulty}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {recipeListData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No recipes found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeList;
