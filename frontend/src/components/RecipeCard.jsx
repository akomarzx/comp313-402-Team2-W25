import Image from "next/image";
import React, { useState } from "react";
import { ChefHatIcon, HeartIcon, Clock, Users } from "lucide-react";
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
    version === 2 ? "w-[190px] min-h-[220px]" : "w-full min-h-[300px]";
  const imageStyle = version === 2 ? "h-[150px]" : "h-[180px]";

  // Local state for toggling saved status
  const [saved, setSaved] = useState(data?.isFavorite);

  /**
   * Handle click event for saving or unsaving a recipe.
   */
  const handleSaveClick = async (e) => {
    e.stopPropagation();
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
      className="group relative bg-white border border-gray-100 hover:border-gray-200 rounded-lg overflow-hidden cursor-pointer"
      onClick={() => router.push(`/recipe/${data?.id}`)}
    >
      {/* Recipe image */}
      <div className={`relative w-full ${imageStyle} overflow-hidden`}>
        <Image
          unoptimized
          src={
            data?.thumbnailUrl ||
            "https://www.themealdb.com/images/media/meals/58oia61564916529.jpg"
          }
          alt={data?.title}
          fill
          sizes="100%"
          className="object-cover transition-all duration-500 group-hover:scale-105"
          priority
        />

        {/* Favorite button overlay */}
        {user && version !== 2 && (
          <button
            className="absolute top-2 right-2 z-10 bg-white p-1.5 rounded-full hover:bg-gray-50"
            onClick={handleSaveClick}
          >
            <HeartIcon
              size={18}
              className={`${saved ? "fill-red-500" : ""} text-red-500`}
            />
          </button>
        )}
      </div>

      {/* Recipe content */}
      <div className="p-3">
        {/* Recipe title */}
        <h3 className="font-medium text-base line-clamp-2 mb-1 text-gray-800">
          {data?.title}
        </h3>

        {/* Recipe metadata */}
        {version === 1 && (
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            {/* Categories */}
            {data?.category && (
              <div className="flex gap-1 flex-wrap">
                <span>{data?.category?.split(",")[0]?.trim()}</span>
                {data?.category?.split(",").length > 1 && (
                  <span>+{data?.category?.split(",").length - 1}</span>
                )}
              </div>
            )}

            {/* Recipe rating */}
            {data?.ratingValue !== null && data?.ratingCount > 0 && (
              <div className="flex items-center">
                <ChefHatIcon
                  size={14}
                  className={`mr-0.5 ${
                    data?.ratingValue >= 4
                      ? "text-green-600"
                      : data?.ratingValue >= 3
                      ? "text-yellow-500"
                      : "text-gray-400"
                  }`}
                />
                <span>
                  {data?.ratingValue} ({data?.ratingCount})
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
