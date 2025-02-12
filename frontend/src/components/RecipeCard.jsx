import Image from "next/image";
import React from "react";
import Link from "next/link";
import { ChefHatIcon } from "lucide-react";

const RecipeCard = ({ data, version = 1 }) => {
  const cardStyle =
    version === 2
      ? "w-[170px] min-h-[180px] p-2"
      : "w-[300px] min-h-[300px] p-4";

  const imageStyle = version === 2 ? "h-[150px]" : "h-[200px]";

  return (
    <div
      className={`hover:scale-[101%] border ${cardStyle} max-h-[500px]  bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-700 mx-auto`}
    >
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
              version === 2 ? "font-bold" : "font-semibold"
            } font-bold text-gray-800 truncate`}
          >
            {data?.title}
          </h3>
          {version === 1 && (
            <div className="flex mt-2 w-full justify-between">
              <p className="text-sm text-gray-600 line-clamp-1 flex">
                <span className="border rounded-full px-2 bg-blue-100">
                  {data?.category}
                </span>
              </p>
              <p className="text-sm text-gray-600 flex items-right font-semibold">
                {data?.ratingValue && (
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
