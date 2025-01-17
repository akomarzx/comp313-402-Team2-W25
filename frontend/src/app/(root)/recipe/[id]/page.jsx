"use client";
import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
const Recipe = () => {
  const { id } = useParams();
  const recipe = {
    title: "Spaghetti Carbonara",
    subtitle: "A classic Italian pasta dish",
    imgUrl: "https://fakeimg.pl/600x400",
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
  };

  return (
    <div>
      <div className=" min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Recipe Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {recipe.title}
            </h1>
            <p className="text-gray-600">{recipe.subtitle}</p>
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
        </div>
      </div>
    </div>
  );
};

export default Recipe;
