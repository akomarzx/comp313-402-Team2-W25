import { ChefHat, ChefHatIcon, Clock } from "lucide-react";
import Image from "next/image";
import React from "react";
import Link from "next/link";

const RecipeRow = ({ recipe }) => {
  return (
    <Link href={`/recipe/${recipe?.id}`}>
      <div
        key={recipe.id}
        className="flex items-center gap-6 my-8 border-x-[1px] bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer"
      >
        <div className="w-48 h-32 flex-shrink-0">
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
            <p className="text-sm text-gray-600 line-clamp-1 flex">
              <span className="border rounded-full px-2 bg-blue-100 font-semibold">
                {recipe?.category}
              </span>
            </p>
            <p className="text-sm text-gray-600 flex font-semibold">
              {recipe?.ratingValue && (
                <span className="flex items0">
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
  );
};

export default RecipeRow;
