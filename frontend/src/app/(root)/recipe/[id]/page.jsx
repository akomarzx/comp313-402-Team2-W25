"use client";
import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

const Recipe = () => {
  const { id } = useParams();
  const recipe = {
    title: "Spaghetti Carbonara",
    summary: "A classic Italian pasta dish",
    imgUrl: "https://fakeimg.pl/600x400",
    prepTime: 15,
    prepTimeUnit: "minutes",
    cookTime: 20,
    cookTimeUnit: "minutes",
    servings: 4,
    yield: "4 generous portions",
    nutritionInfo: {
      calories: 650.5,
      carbs: 75.2,
      sugars: 3.5,
      fat: 28.4,
    },
    ingredients: [
      "200g spaghetti",
      "100g pancetta",
      "2 large eggs",
      "50g pecorino cheese, grated",
      "50g parmesan cheese, grated",
      "Freshly ground black pepper",
      "Salt",
    ],
    instructions: [
      "Cook the spaghetti in a large pot of salted boiling water until al dente.",
      "Meanwhile, heat a large skillet and cook the pancetta until crispy.",
      "In a bowl, whisk together the eggs, pecorino, and parmesan cheese.",
      "Reserve a cup of pasta water, then drain the spaghetti.",
      "Add the spaghetti to the skillet with pancetta, and toss to combine.",
      "Remove the skillet from heat and quickly stir in the egg and cheese mixture.",
      "Add reserved pasta water as needed to create a creamy sauce.",
      "Season with freshly ground black pepper and serve immediately.",
    ],
    createdBy: "John Doe",
    createdAt: "2024-02-20T10:30:00Z",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {recipe.title}
          </h1>
          <p className="text-gray-600">{recipe.summary}</p>
        </div>

        {/* Recipe Image */}
        <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-8">
          <Image
            src={recipe.imgUrl}
            alt={recipe.title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>

        {/* Recipe Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Ingredients */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Ingredients
            </h2>
            <ul className="list-disc list-inside text-gray-700">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Instructions
            </h2>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              {recipe.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
        {/* Recipe Info */}
        <div className="bg-white p-8 rounded-xl shadow-lg my-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
              <p className="text-gray-600 text-sm uppercase tracking-wide">
                Prep Time
              </p>
              <p className="font-semibold text-lg mt-1">
                {recipe.prepTime} {recipe.prepTimeUnit}
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
              <p className="text-gray-600 text-sm uppercase tracking-wide">
                Cook Time
              </p>
              <p className="font-semibold text-lg mt-1">
                {recipe.cookTime} {recipe.cookTimeUnit}
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
              <p className="text-gray-600 text-sm uppercase tracking-wide">
                Servings
              </p>
              <p className="font-semibold text-lg mt-1">{recipe.servings}</p>
            </div>
            <div className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
              <p className="text-gray-600 text-sm uppercase tracking-wide">
                Yield
              </p>
              <p className="font-semibold text-lg mt-1">{recipe.yield}</p>
            </div>
          </div>
        </div>

        {/* Nutrition Information */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Nutrition Facts
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <p className="text-gray-600 text-sm uppercase tracking-wide">
                Calories
              </p>
              <p className="font-semibold text-lg mt-1">
                {recipe.nutritionInfo.calories}
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <p className="text-gray-600 text-sm uppercase tracking-wide">
                Carbs
              </p>
              <p className="font-semibold text-lg mt-1">
                {recipe.nutritionInfo.carbs}g
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <p className="text-gray-600 text-sm uppercase tracking-wide">
                Sugars
              </p>
              <p className="font-semibold text-lg mt-1">
                {recipe.nutritionInfo.sugars}g
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <p className="text-gray-600 text-sm uppercase tracking-wide">
                Fat
              </p>
              <p className="font-semibold text-lg mt-1">
                {recipe.nutritionInfo.fat}g
              </p>
            </div>
          </div>
        </div>

        {/* Recipe Meta Information */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-600">
            <p className="flex items-center">
              <span className="font-medium mr-2">Created by:</span>{" "}
              {recipe.createdBy}
            </p>
            <p className="flex items-center">
              <span className="font-medium mr-2">Created on:</span>
              {new Date(recipe.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recipe;
