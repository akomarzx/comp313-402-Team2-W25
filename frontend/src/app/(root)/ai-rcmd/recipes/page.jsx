"use client";

import React, { useState } from "react";

import { useSearchParams } from "next/navigation";
import RecipesResult from "@/components/RecipesResult";
import { RotateLoader } from "react-spinners";
import { useRouter } from "next/navigation";

const AIRecipies = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const data = JSON.parse(searchParams.get("data") || "{}");

  const [isQuerying, setIsQuerying] = useState(true);
  const [recipeCardData, setRecipeCardData] = useState([]);
  React.useEffect(() => {
    console.log(data);
    router.push("/ai-rcmd/recipes");
    const timer = setTimeout(() => {
      setRecipeCardData([
        {
          id: "1",
          imgUrl:
            "https://www.themealdb.com/images/media/meals/58oia61564916529.jpg",
          title: "Not Beef and Mustard Pie",
          description: "Not A delicious beef and mustard pie",
        },
        {
          id: "2",
          imgUrl:
            "https://www.themealdb.com/images/media/meals/58oia61564916529.jpg",
          title: "Not Beef and Mustard Pie",
          description: "Not A delicious beef and mustard pie",
        },
        {
          id: "3",
          imgUrl:
            "https://www.themealdb.com/images/media/meals/58oia61564916529.jpg",
          title: "Not Beef and Mustard Pie",
          description: "Not A delicious beef and mustard pie",
        },
      ]);
      setIsQuerying(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="py-10">
      <div className="border-t-2">
        {searchParams && isQuerying ? (
          <div className="mx-auto text-center mt-40">
            <p className="mb-10">
              {" "}
              Our AI is cooking up your repies please wait ...
            </p>
            <RotateLoader></RotateLoader>
          </div>
        ) : (
          <RecipesResult isSearching="" recipeCardData={recipeCardData} />
        )}
      </div>
    </div>
  );
};

export default AIRecipies;
