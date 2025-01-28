"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getRecipeById } from "@/api/recipe";
import { RotateLoader } from "react-spinners";

const Recipe = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  useEffect(() => {
    const fetchRecipe = async () => {
      const data = await getRecipeById(id);
      setRecipe(data);
      console.log(data);
    };
    fetchRecipe().then(() => setIsLoading(false));
  }, [id]);
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {!isLoading ? (
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {recipe?.title}
            </h1>
            <p className="text-gray-600">{recipe?.summary}</p>
          </div>

          {/* Recipe Image */}
          <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-8">
            <Image
              src={
                (recipe?.imageUrl !== "x" && recipe?.imageUrl) ||
                "https://www.themealdb.com/images/media/meals/58oia61564916529.jpg"
              }
              alt={recipe?.title || "image"}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          {/* Recipe Meta Information */}
          <div className="my-4  border-b border-gray-200">
            <div className="flex justify-between text-sm text-gray-600">
              <p className="flex items-center">
                <span className="font-medium mr-2">Author:</span>{" "}
                {recipe?.createdBy}
              </p>
              <p className="flex items-center">
                <span className="font-medium mr-2">Created on:</span>
                {new Date(recipe?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          {/* Recipe Details */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Ingredients */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Ingredients
              </h2>
              <ol className="list list-inside text-gray-700">
                {recipe?.ingredientGroups
                  .sort(
                    (a, b) => a.ingredientGroupOrder - b.ingredientGroupOrder
                  )
                  .map((ingredientGroup, index) => (
                    <li key={index} className="mb-4">
                      <h3 className="font-semibold text-lg">
                        {ingredientGroup.label}
                      </h3>
                      <ul className="list-disc list-inside text-gray-700">
                        {ingredientGroup.ingredients
                          .sort((a, b) => a.ingredientOrder - b.ingredientOrder)
                          .map((ingredient, index) => (
                            <li key={index}>{ingredient.label}</li>
                          ))}
                      </ul>
                    </li>
                  ))}
              </ol>
            </div>

            {/* Instructions */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Instructions
              </h2>
              <ol className="list list-inside text-gray-700 space-y-2">
                {recipe?.stepGroups
                  .sort((a, b) => a.stepGroupOrder - b.stepGroupOrder)
                  .map((stepGroup, index) => (
                    <li key={index} className="mb-4">
                      <h3 className="font-semibold text-lg">
                        {stepGroup.label}
                      </h3>
                      <ol className="list-decimal list-inside text-gray-700">
                        {stepGroup.steps
                          .sort((a, b) => a.stepOrder - b.stepOrder)
                          .map((step, index) => (
                            <li key={index}>{step.description}</li>
                          ))}
                      </ol>
                    </li>
                  ))}
              </ol>
            </div>
          </div>
          {/* Recipe Info */}
          <div className="bg-white p-8 rounded-xl shadow-lg my-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Recipe Information
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                <p className="text-gray-600 text-sm uppercase tracking-wide">
                  Prep Time
                </p>
                <p className="font-semibold text-lg mt-1">
                  {recipe?.prepTime} {recipe?.prepTimeUnitCd.label}
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                <p className="text-gray-600 text-sm uppercase tracking-wide">
                  Cook Time
                </p>
                <p className="font-semibold text-lg mt-1">
                  {recipe?.cookTime} {recipe?.cookTimeUnitCd.label}
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                <p className="text-gray-600 text-sm uppercase tracking-wide">
                  Servings
                </p>
                <p className="font-semibold text-lg mt-1">{recipe?.servings}</p>
              </div>
              <div className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                <p className="text-gray-600 text-sm uppercase tracking-wide">
                  Yield
                </p>
                <p className="font-semibold text-lg mt-1">{recipe?.yield}</p>
              </div>
            </div>
          </div>

          {/* Nutrition Information */}
          <div className="bg-white p-8 rounded-xl shadow-lg my-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Nutrition Facts
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 border bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <p className="text-gray-600 text-sm uppercase tracking-wide">
                  Calories
                </p>
                <p className="font-semibold text-lg mt-1">{recipe?.calories}</p>
              </div>
              <div className="text-center p-4 border bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <p className="text-gray-600 text-sm uppercase tracking-wide">
                  Carbs
                </p>
                <p className="font-semibold text-lg mt-1">{recipe?.carbsG}g</p>
              </div>
              <div className="text-center p-4 border bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <p className="text-gray-600 text-sm uppercase tracking-wide">
                  Sugars
                </p>
                <p className="font-semibold  text-lg mt-1">
                  {recipe?.sugarsG}g
                </p>
              </div>
              <div className="text-center p-4 border bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <p className="text-gray-600 text-sm uppercase tracking-wide">
                  Fat
                </p>
                <p className="font-semibold text-lg mt-1">{recipe?.fatG}g</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-40">
          <RotateLoader />
        </div>
      )}
    </div>
  );
};

export default Recipe;
