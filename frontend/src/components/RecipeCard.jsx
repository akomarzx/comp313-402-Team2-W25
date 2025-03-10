import Image from "next/image";
import React, { useState } from "react";
import { ChefHatIcon, HeartIcon } from "lucide-react";
import { toast } from "sonner";
import { saveRecipe, unsaveRecipe } from "@/api/recipe";
import { useRouter } from "next/navigation";

/**
 * RecipeCard component displays recipe details.
 *
 * Props:
 *  - data: Recipe data object.
 *  - version: Layout version (default is 1).
 *  - user: User object, used for handling favorite actions.
 */
const RecipeCard = ({ data, version = 1, user = {} }) => {
  const router = useRouter();

  // Set card sizing based on the component version
  const cardStyle =
    version === 2
      ? "w-[190px] min-h-[220px] p-2"
      : "w-[250px] min-h-[300px] p-4";
  const imageStyle = version === 2 ? "h-[150px]" : "h-[200px]";

  // Local state for toggling saved status
  const [saved, setSaved] = useState(data?.isFavorite);

  /**
   * Handle click event for saving or unsaving a recipe.
   */
  const handleSaveClick = async () => {
    if (!saved) {
      // Save recipe
      const res = await saveRecipe(data.id);
      if (res?.status === 200 || res?.status === 201) {
        setSaved(true);
        toast("Recipe saved successfully");
      }
    } else {
      // Unsave recipe
      const res = await unsaveRecipe(data.id);
      if (res?.status === 200) {
        setSaved(false);
        toast("Removed from saved recipes");
      }
    }
  };

  return (
    <div
      className={`slide-up relative hover:scale-[101%] border ${cardStyle} max-h-[400px] bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-700 mx-auto`}
    >
      {/* Favorite icon: visible only when user is provided and on version 1 */}
      {user && version !== 2 && (
        <div className="absolute top-5 right-5 z-10">
          <HeartIcon
            size={25}
            className={`${
              saved ? "fill-red-500" : ""
            } text-red-500 hover:scale-110`}
            onClick={handleSaveClick}
          />
        </div>
      )}

      {/* Recipe image with click action to navigate to recipe detail */}
      <div
        className={`relative w-full ${imageStyle} rounded-md overflow-hidden`}
        onClick={() => router.push(`/recipe/${data?.id}`)}
      >
        <Image
          unoptimized
          src={
            data?.thumbnailUrl ||
            "https://www.themealdb.com/images/media/meals/58oia61564916529.jpg"
          }
          alt={data?.title}
          fill
          sizes="100%"
          className="rounded-t-lg"
          priority
        />
      </div>

      <div className="pt-4">
        {/* Recipe title */}
        <h3
          className={`${
            version === 2 ? "font-bold line-clamp-2" : "font-semibold truncate"
          } font-bold text-gray-800`}
        >
          {data?.title}
        </h3>

        {/* Additional recipe details for version 1 */}
        {version === 1 && (
          <div className="flex mt-2 w-full justify-between">
            {/* Recipe categories */}
            <p className="text-sm line-clamp-1">
              {data?.category?.split(",").map((cat, i) => (
                <span key={i}>
                  <span className="text-blue-600 border rounded-full px-2 bg-blue-100">
                    {cat}
                  </span>
                  &nbsp;
                </span>
              ))}
            </p>

            {/* Recipe rating */}
            <p className="text-sm text-gray-600 flex items-right font-semibold">
              {data?.ratingValue !== null && data?.ratingCount > 0 && (
                <span className="flex items-center">
                  <ChefHatIcon
                    size={20}
                    className={
                      data?.ratingValue >= 4
                        ? "text-green-600"
                        : data?.ratingValue >= 3
                        ? "text-yellow-400"
                        : data?.ratingValue >= 2
                        ? "text-orange-400"
                        : data?.ratingValue >= 1
                        ? "text-red-400"
                        : "text-gray-400"
                    }
                  />
                  {data?.ratingValue}({data?.ratingCount})
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
