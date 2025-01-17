import Image from "next/image";
import React from "react";
import Link from "next/link";

const RecipeCard = ({ data }) => {
  return (
    <div className=" hover:scale-105 border w-[300px] min-h-[300px] max-h-[500px] p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link href={`/recipies/${data?.id}`}>
        <div className="relative w-full h-[200px] rounded-md overflow-hidden ">
          <Image
            src={data?.imgUrl}
            alt={data?.title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
        </div>

        <div className="py-4">
          <h3 className="text-lg font-bold text-gray-800 truncate">
            {data?.title}
          </h3>
          <p className="text-sm text-gray-600 mt-2 line-clamp-3">
            {data?.description}
          </p>
        </div>
      </Link>{" "}
    </div>
  );
};

export default RecipeCard;
