"use client";
import React, { useState } from "react";
import RecipesResult from "@/components/RecipesResult";
const Recipes = () => {
  const [isSearching, setIsSearching] = useState(false);

  const recipeCardData = [
    {
      id: "1",
      imgUrl:
        "https://www.themealdb.com/images/media/meals/58oia61564916529.jpg",
      title: "Beef and Mustard Pie",
      description: "A delicious beef and mustard pie",
    },
    {
      id: "2",
      imgUrl:
        "https://www.themealdb.com/images/media/meals/58oia61564916529.jpg",
      title: "Beef and Mustard Pie",
      description: "A delicious beef and mustard pie",
    },
    {
      id: "3",
      imgUrl:
        "https://www.themealdb.com/images/media/meals/58oia61564916529.jpg",
      title: "Beef and Mustard Pie",
      description: "A delicious beef and mustard pie",
    },
  ];

  const handleSearch = (e) => {
    e?.key === "Enter" && setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 2000);
  };

  return (
    <div>
      <div className="mx-auto max-w-[600px] mb-5">
        <h3 className="font-semibold text-normal p-2">
          What are you craving for today?
        </h3>
        <input
          type="text"
          placeholder="Search recipes..."
          className="border p-2 w-full rounded-full "
          onKeyDownCapture={handleSearch}
        />
      </div>

      <div className="border-t-2">
        <RecipesResult
          isSearching={isSearching}
          recipeCardData={recipeCardData}
        />
      </div>
    </div>
  );
};

export default Recipes;
