"use client";
import RecipeCard from "@/components/RecipeCard";
import React, { useState } from "react";
import { RotateLoader } from "react-spinners";
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
        <h2 className="font-bold text-2xl text-center mt-10 ">All Recipies</h2>{" "}
        {!isSearching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:px-4 py-4  mx-auto max-w-[1200px]">
            {recipeCardData.map((recipe, index) => (
              <RecipeCard key={index} data={recipe} />
            ))}
          </div>
        ) : (
          <div className="mx-auto text-center mt-40">
            <RotateLoader />
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes;
