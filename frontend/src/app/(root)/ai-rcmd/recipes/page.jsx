"use client";

import React, { Suspense } from "react";

import { useSearchParams } from "next/navigation";
import RecipesResult from "@/components/RecipesResult";

const AIRecipies = () => {
  const searchParams = useSearchParams();
  const data = JSON.parse(searchParams.get("data") || "{}");

  return (
    <div>
      <Suspense>
        <div className="border-t-2">
          <RecipesResult isSearching="" recipeCardData={data} />
        </div>
      </Suspense>
    </div>
  );
};

export default AIRecipies;
