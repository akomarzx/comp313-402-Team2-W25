import React, { useState, useEffect } from "react";

import { BarLoader } from "react-spinners";
import RecipeCard from "@/components/RecipeCard";
import { Circle, Grid, List } from "lucide-react";
import RecipeRow from "./RecipeRow";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const RecipesResult = ({
  isSearching = false,
  isLoading = false,
  recipeCardData = [],
  displayType = "grid",
  sort = "default",
  version = 1,
  user = {},
}) => {
  const [sortOrder, setSortOrder] = useState(sort);
  const [viewMode, setViewMode] = useState(displayType);
  useEffect(() => {
    const lastView = sessionStorage.getItem("view");
    setViewMode(lastView || displayType);
  }, []);

  const getSortedRecipes = () => {
    const recipes = [...recipeCardData];
    switch (sortOrder) {
      case "title-asc":
        return recipes.sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":
        return recipes.sort((a, b) => b.title.localeCompare(a.title));
      case "rating-asc":
        return recipes.sort((a, b) => a.ratingValue - b.ratingValue);
      case "rating-desc":
        return recipes.sort((a, b) => b.ratingValue - a.ratingValue);
      default:
        return recipes;
    }
  };

  return (
    <div className="w-full">
      {version === 1 && (
        <>
          <h2 className="font-bold text-2xl text-center mt-10 ">All Recipes</h2>

          <div className="flex justify-between items-center my-2 w-[90%] mx-auto">
            <div className="my-4 flex justify-end">
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">
                    <span className="flex items-center">
                      <Circle className="mr-2 h-2 w-2 fill-current" />
                      Default Order
                    </span>
                  </SelectItem>
                  <SelectItem value="title-asc">
                    <span className="flex items-center">
                      <Circle className="mr-2 h-2 w-2 fill-current" />
                      Title (A-Z)
                    </span>
                  </SelectItem>
                  <SelectItem value="title-desc">
                    <span className="flex items-center">
                      <Circle className="mr-2 h-2 w-2 fill-current" />
                      Title (Z-A)
                    </span>
                  </SelectItem>
                  <SelectItem value="rating-asc">
                    <span className="flex items-center">
                      <Circle className="mr-2 h-2 w-2 fill-current" />
                      Rating (Low to High)
                    </span>
                  </SelectItem>
                  <SelectItem value="rating-desc">
                    <span className="flex items-center">
                      <Circle className="mr-2 h-2 w-2 fill-current" />
                      Rating (High to Low)
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <button
                className={`px-4 py-2 border rounded mr-2 ${
                  viewMode !== "list"
                    ? "bg-gray-500 text-white"
                    : "bg-white text-gray-500"
                }`}
                onClick={() => {
                  setViewMode("grid");
                  sessionStorage.setItem("view", "grid");
                }}
              >
                <Grid size={20} />
              </button>
              <button
                className={`px-4 py-2 border rounded ${
                  viewMode === "list"
                    ? "bg-gray-500 text-white"
                    : "bg-white text-gray-500"
                }`}
                onClick={() => {
                  setViewMode("list");
                  sessionStorage.setItem("view", "list");
                }}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </>
      )}
      {!isSearching && !isLoading ? (
        <>
          {viewMode === "list" && version === 1 ? (
            <div className="mx-auto w-[90%]">
              {getSortedRecipes().map((recipe, index) => (
                <RecipeRow key={index} recipe={recipe} user={user} />
              ))}
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 ${
                version === 2
                  ? "md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
                  : "lg:grid-cols-2 min-[1250px]:grid-cols-3 2xl:grid-cols-3"
              } gap-6 xl:px-4 py-4 mx-auto max-w-[1200px]`}
            >
              {getSortedRecipes().map((recipe, index) => (
                <RecipeCard
                  key={index}
                  data={recipe}
                  version={version}
                  user={user}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="mx-auto text-center my-40 w-full">
          <BarLoader className="mx-auto" />
        </div>
      )}
    </div>
  );
};

export default RecipesResult;
