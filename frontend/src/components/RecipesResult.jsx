import React, { useState, useEffect } from "react";

import { BarLoader } from "react-spinners";
import RecipeCard from "@/components/RecipeCard";
import { Circle, Grid, List, RefreshCwIcon } from "lucide-react";
import RecipeRow from "./RecipeRow";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { redirect, useRouter } from "next/navigation";

const RecipesResult = ({
  isSearching = false,
  isLoading = false,
  recipeCardData = [],
  displayType = "grid",
  sort = "default",
  version = 1,
  searchKey = "",
  user = {},
}) => {
  const [viewMode, setViewMode] = useState(displayType);
  const router = useRouter();

  useEffect(() => {
    const lastView = sessionStorage.getItem("view");
    setViewMode(lastView || displayType);
    console.log(sort);
  }, []);

  const handleSortChange = (e) => {
    setTimeout(() => {
      switch (e) {
        case "title-asc":
          console.log(e);
          redirect(`/recipes?sort=title-asc&search=${searchKey}`);
        case "title-desc":
          redirect(`/recipes?sort=title-desc&search=${searchKey}`);
        case "rating-asc":
          redirect(`/recipes?sort=rating-asc&search=${searchKey}`);
        case "rating-desc":
          redirect(`/recipes?sort=rating-desc&search=${searchKey}`);
        default:
          redirect(`/recipes`);
      }
    }, 10);
  };

  return (
    <div className="w-full">
      {version === 1 && (
        <>
          <h2 className="font-bold text-2xl text-center mt-10 ">All Recipes</h2>
          {recipeCardData.length === 0 && !isLoading ? (
            <div className="mx-auto text-center mt-20">
              <p className="mb-10">No recipes found...</p>
            </div>
          ) : (
            <div className="flex justify-between items-center my-2 w-[90%] mx-auto">
              <div className="my-4 flex justify-end">
                <Select
                  value={sort}
                  onValueChange={handleSortChange}
                  closeOnSelect
                >
                  <SelectTrigger className="w-[140px] md:w-[180px]">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"default"}>
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
                <button
                  className="px-2 py-2 md:px-4 border rounded ml-2"
                  onClick={() => {
                    window.location.replace("/recipes?page=1");
                  }}
                >
                  <RefreshCwIcon size={20} />
                </button>
              </div>

              <div>
                <button
                  className={`px-2 py-2 md:px-4 border rounded mr-2 ${
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
                  className={`px-2 py-2 md:px-4 border rounded ${
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
          )}
        </>
      )}
      {!isSearching && !isLoading ? (
        <>
          {viewMode === "list" && version === 1 ? (
            <div className="mx-auto w-[90%]">
              {recipeCardData?.map((recipe, index) => (
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
              {recipeCardData?.map((recipe, index) => (
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
