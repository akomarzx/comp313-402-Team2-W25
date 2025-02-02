import React from "react";

import { RotateLoader } from "react-spinners";
import RecipeCard from "@/components/RecipeCard";

const RecipesResult = ({
  isSearching = false,
  recipeCardData = [],
  version = 1,
}) => {
  return (
    <div>
      {version === 1 && (
        <h2 className="font-bold text-2xl text-center mt-10 ">All Recipies</h2>
      )}
      {!isSearching ? (
        <div
          className={`grid grid-cols-1 ${
            version === 2
              ? "md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
              : "lg:grid-cols-2 2xl:grid-cols-3"
          } gap-6 xl:px-4 py-4 mx-auto max-w-[1200px]`}
        >
          {recipeCardData.map((recipe, index) => (
            <RecipeCard key={index} data={recipe} version={version} />
          ))}
        </div>
      ) : (
        <div className="mx-auto text-center mt-40">
          <RotateLoader />
        </div>
      )}
    </div>
  );
};

export default RecipesResult;
