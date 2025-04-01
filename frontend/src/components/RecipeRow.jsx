import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChefHatIcon, HeartIcon, Clock, Users } from "lucide-react";
import { toast } from "sonner";
import { saveRecipe, unsaveRecipe } from "@/api/recipe";

/**
 * RecipeRow Component
 * Renders a recipe card with details and save/unsave functionality.
 *
 * Props:
 * - recipe: Object containing recipe details.
 * - user: Logged-in user object.
 */
const RecipeRow = ({ recipe, user }) => {
  // Track saved status of the recipe.
  const [saved, setSaved] = useState(recipe?.isFavorite);

  /**
   * Toggle saved/unsaved recipe.
   */
  const handleSaveClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!saved) {
      const res = await saveRecipe(recipe.id);
      if (res?.status === 200 || res?.status === 201) {
        setSaved(true);
        toast("Recipe saved successfully");
      }
    } else {
      const res = await unsaveRecipe(recipe.id);
      if (res?.status === 200) {
        setSaved(false);
        toast("Removed from saved recipes");
      }
    }
  };

  return (
    <Link
      href={`/recipe/${recipe?.id}`}
      className="block transform transition-all duration-300 hover:-translate-y-1"
    >
      <div className="group relative slide-up bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden mb-6">
        {/* Favorite button */}
        {user && (
          <button
            onClick={handleSaveClick}
            className="absolute top-3 right-3 z-10 bg-white/80 p-1.5 rounded-full shadow-sm opacity-80 hover:opacity-100 transition-opacity"
          >
            <HeartIcon
              size={20}
              className={`text-red-500 transition-all ${
                saved ? "fill-red-500" : ""
              }`}
            />
          </button>
        )}

        <div className="flex flex-col sm:flex-row items-center p-4">
          {/* Recipe Thumbnail */}
          <div className="w-full sm:w-48 h-48 sm:h-32 rounded-xl overflow-hidden flex-shrink-0 mb-4 sm:mb-0">
            <div className="relative w-full h-full">
              <Image
                unoptimized
                src={recipe.thumbnailUrl || "/placeholder.svg"}
                alt={recipe.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Recipe Details */}
          <div className="flex-grow sm:ml-6 w-full">
            <h3 className="text-xl font-semibold mb-2 line-clamp-1 text-gray-800">
              {recipe?.title}
            </h3>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {recipe?.description ||
                "A delicious recipe that's quick and easy to prepare."}
            </p>

            <div className="flex flex-wrap gap-y-3 items-center justify-between">
              {/* Recipe Categories */}
              <div className="flex flex-wrap gap-1 max-w-full overflow-hidden">
                {recipe?.category
                  ?.split(",")
                  .slice(0, 3)
                  .map((cat, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full"
                    >
                      {cat.trim()}
                    </span>
                  ))}
                {recipe?.category?.split(",").length > 3 && (
                  <span className="text-xs font-medium text-gray-500 px-1">
                    +{recipe?.category?.split(",").length - 3}
                  </span>
                )}
              </div>

              {/* Mock recipe info and Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center text-gray-500 text-xs">
                  <Clock size={14} className="mr-1" />
                  <span>{recipe?.cookTime || "30 min"}</span>
                </div>

                {recipe?.ratingValue !== null && recipe?.ratingCount > 0 && (
                  <div className="flex items-center bg-gray-50 py-1 px-2 rounded-full">
                    <ChefHatIcon
                      size={16}
                      className={`mr-1 ${
                        recipe?.ratingValue >= 4
                          ? "text-green-600"
                          : recipe?.ratingValue >= 3
                          ? "text-yellow-500"
                          : recipe?.ratingValue >= 2
                          ? "text-orange-500"
                          : recipe?.ratingValue >= 1
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                    <span className="text-xs font-medium">
                      {recipe?.ratingValue}
                      <span className="text-gray-500 ml-0.5">
                        ({recipe?.ratingCount})
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeRow;
