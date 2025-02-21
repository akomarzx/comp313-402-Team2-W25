import { ChefHat, ChefHatIcon, Clock, HeartIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { saveRecipe, unsaveRecipe } from "@/api/recipe";
import { toast } from "sonner";

const RecipeRow = ({ recipe, user }) => {
  const [saved, setSaved] = useState(recipe?.isFavorite);
  const handleSaveClick = async () => {
    if (!data.isFavorite) {
      const res = await saveRecipe(recipe.id);
      if (res?.status === 200 || 201) {
        setSaved(!saved);
        toast("Recipe saved successfully");
      }
    } else {
      const res = await unsaveRecipe(recipe.id);
      if (res?.status === 200) {
        setSaved(!saved);
        toast("Removed from saved recipes");
      }
    }
  };
  return (
    <div className="relative slide-up">
      {" "}
      {user && (
        <div className="absolute top-5 right-5 z-10">
          <HeartIcon
            size={25}
            className={`${
              saved && "fill-red-500"
            } text-red-500 hover:scale-110`}
            onClick={handleSaveClick}
          />
        </div>
      )}
      <Link href={`/recipe/${recipe?.id}`}>
        <div
          key={recipe.id}
          className="flex flex-col sm:flex-row relative items-center gap-6 my-8 border-x-[1px] bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer"
        >
          <div className="w-48 h-32 flex-shrink-0 mx-auto">
            <Image
              src={recipe.thumbnailUrl || "/placeholder.svg"}
              alt={recipe.title}
              width={192}
              height={128}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
          <div className="flex-grow">
            <h3 className="font-serif text-xl font-semibold mb-2">
              {recipe?.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {recipe?.description}
            </p>
            <div className="flex w-full space-between gap-4 text-sm text-gray-500">
              <p className="text-sm line-clamp-1 w-1/2">
                {recipe?.category?.split(",").map((cat, i) => (
                  <span key={i}>
                    <span className="text-blue-600 border rounded-full px-2 bg-blue-100">
                      {cat}
                    </span>
                    &nbsp;{" "}
                  </span>
                ))}
              </p>
              <p className="text-sm text-gray-600  font-semibold w-1/2 text-right">
                {recipe?.ratingValue !== null && recipe?.ratingCount > 0 && (
                  <span className="flex items-center  justify-end">
                    <ChefHatIcon
                      size={20}
                      className={
                        recipe?.ratingValue >= 4
                          ? "text-green-600"
                          : recipe?.ratingValue >= 3
                          ? "text-yellow-400"
                          : recipe?.ratingValue >= 2
                          ? "text-orange-400"
                          : recipe?.ratingValue >= 1
                          ? "text-red-400"
                          : "text-gray-400"
                      }
                    />
                    {recipe?.ratingValue}({recipe?.ratingCount})
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RecipeRow;
