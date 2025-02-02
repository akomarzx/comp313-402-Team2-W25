import Image from "next/image";
import React from "react";
import Link from "next/link";

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
          />
        </div>

        <div className="py-4">
          <h3
            className={`${
              version === 2 ? "font-bold" : "font-semibold"
            } font-bold text-gray-800 truncate`}
          >
            {data?.title}
          </h3>
          {version === 1 && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-3">
              {data?.summary}
            </p>
          )}
        </div>
      </Link>{" "}
    </div>
  );
};

export default RecipeCard;
