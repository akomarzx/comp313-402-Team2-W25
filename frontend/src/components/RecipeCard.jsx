import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { ChefHatIcon, HeartIcon } from "lucide-react";
import { toast } from "sonner";
import { saveRecipe } from "@/api/recipe";

const RecipeCard = ({ data, version = 1, user = {} }) => {
  const cardStyle =
    version === 2
      ? "w-[190px] min-h-[220px] p-2"
      : "w-[300px] min-h-[300px] p-4";

  const imageStyle = version === 2 ? "h-[150px]" : "h-[200px]";
  const [saved, setSaved] = useState(false);
  const handleSaveClick = async () => {
    const res = await saveRecipe(data.id);
    if (res?.status === 200 || 201) {
      setSaved(!saved);
      toast("Recipe saved successfully");
    }
  };

  return (
    <div
      className={` relative hover:scale-[101%] border ${cardStyle} max-h-[400px]  bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-700 mx-auto`}
    >
      {user && version !== 2 && (
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
      <Link href={`/recipe/${data?.id}`}>
        <div
          className={`relative w-full ${imageStyle} rounded-md overflow-hidden`}
        >
          <Image
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
          <h3
            className={`${
              version === 2
                ? "font-bold line-clamp-2"
                : "font-semibold truncate"
            } font-bold text-gray-800 `}
          >
            {data?.title}
          </h3>
          {version === 1 && (
            <div className="flex mt-2 w-full justify-between">
              <p className="text-sm line-clamp-1">
                {data?.category?.split(",").map((cat, i) => (
                  <span key={i}>
                    <span className="text-blue-600 border rounded-full px-2 bg-blue-100">
                      {cat}
                    </span>
                    &nbsp;{" "}
                  </span>
                ))}
              </p>
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
      </Link>{" "}
    </div>
  );
};

export default RecipeCard;
