import RecipeCard from "@/components/RecipeCard";
import React from "react";

const Recipes = () => {
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

  return (
    <div>
      <h2 className="font-bold text-2xl text-center mt-10 ">All Recipies</h2>
      <div className="grid grid-cols-1  md:grid-cols-3 gap-6 p-4  mx-auto max-w-[1200px]">
        {recipeCardData.map((recipe, index) => (
          <RecipeCard key={index} data={recipe} />
        ))}
      </div>
    </div>
  );
};

export default Recipes;
