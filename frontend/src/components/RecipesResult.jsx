import React, { useState, useEffect } from "react";
import { BarLoader } from "react-spinners";
import RecipeCard from "@/components/RecipeCard";
import {
  Circle,
  Grid,
  List,
  RefreshCwIcon,
  SlidersHorizontal,
} from "lucide-react";
import RecipeRow from "./RecipeRow";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { redirect } from "next/navigation";

const RecipesResult = ({
  isSearching = false,
  isLoading = false,
  recipeCardData = [],
  displayType = "grid",
  sort = "default",
  version = 1,
  searchKey = "",
  user = {},
  selectedCategory = [],
}) => {
  // State for the current view mode (grid or list)
  const [viewMode, setViewMode] = useState(displayType);

  // Restore view mode from session storage if available
  useEffect(() => {
    const lastView = sessionStorage.getItem("view");
    setViewMode(lastView || displayType);
  }, [displayType]);

  // Change page routing based on sort option selected
  const handleSortChange = (selectedSort) => {
    setTimeout(() => {
      // Construct query string with the selected sort option and other parameters
      let category = selectedCategory[0] || "";
      switch (selectedSort) {
        case "title-asc":
          redirect(
            `/recipes?sort=title-asc&search=${searchKey}&category=${category}`
          );
          break;
        case "title-desc":
          redirect(
            `/recipes?sort=title-desc&search=${searchKey}&category=${category}`
          );
          break;
        case "rating-asc":
          redirect(
            `/recipes?sort=rating-asc&search=${searchKey}&category=${category}`
          );
          break;
        case "rating-desc":
          redirect(
            `/recipes?sort=rating-desc&search=${searchKey}&category=${category}`
          );
          break;
        default:
          redirect(`/recipes`);
          break;
      }
    }, 10);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Section header and controls for version 1 */}
      {version === 1 && (
        <>
          <h2 className="font-bold text-2xl text-gray-800 mb-6 mt-10">
            {searchKey ? `Search Results for "${searchKey}"` : "All Recipes"}
            {selectedCategory[0] && (
              <span className="ml-2 text-lg font-normal text-gray-500">
                in {selectedCategory[0]}
              </span>
            )}
          </h2>

          {/* No recipes found message */}
          {recipeCardData.length === 0 && !isLoading ? (
            <div className="mx-auto text-center mt-12 py-16 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">No recipes found...</p>
              <button
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 mx-auto"
                onClick={() => window.location.assign("/recipes?page=1")}
              >
                <RefreshCwIcon size={16} />
                <span>Reset Filters</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row justify-between items-center gap-y-4 mb-8">
              {/* Sorting dropdown */}
              <div className="w-full md:w-auto flex items-center gap-2">
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg px-2 py-1 flex items-center">
                  <SlidersHorizontal size={16} className="text-gray-500 mr-2" />
                  <Select
                    value={sort}
                    onValueChange={handleSortChange}
                    closeOnSelect
                  >
                    <SelectTrigger className="border-0 shadow-none p-1 min-h-0 h-auto text-sm font-medium focus:ring-0">
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

                {/* Refresh button */}
                <button
                  className="p-2 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors"
                  onClick={() => window.location.assign("/recipes?page=1")}
                  title="Reset filters"
                >
                  <RefreshCwIcon size={16} className="text-gray-600" />
                </button>
              </div>

              {/* View mode toggle buttons */}
              <div className="flex items-center bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className={`p-2 flex items-center justify-center transition-colors ${
                    viewMode !== "list"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setViewMode("grid");
                    sessionStorage.setItem("view", "grid");
                  }}
                >
                  <Grid size={16} />
                </button>
                <div className="w-px h-6 bg-gray-200"></div>
                <button
                  className={`p-2 flex items-center justify-center transition-colors ${
                    viewMode === "list"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setViewMode("list");
                    sessionStorage.setItem("view", "list");
                  }}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Recipes display */}
      {!isSearching && !isLoading ? (
        <>
          {viewMode === "list" && version === 1 ? (
            <div className="mx-auto">
              {recipeCardData.map((recipe, index) => (
                <RecipeRow key={index} recipe={recipe} user={user} />
              ))}
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 ${
                version === 2
                  ? "sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
                  : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4"
              } gap-6 py-4 mx-auto`}
            >
              {recipeCardData.map((recipe, index) => (
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
        // Loading spinner
        <div className="flex flex-col items-center justify-center py-20">
          <BarLoader color="#3b82f6" />
          <p className="mt-4 text-gray-500 text-sm">Loading recipes...</p>
        </div>
      )}
    </div>
  );
};

export default RecipesResult;
