import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { X, Filter, Check } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * CategoriesFilter Component
 *
 * Renders category filter UI for desktop and mobile views.
 *
 * Props:
 * - categories: Array of category objects.
 * - selectedCategory: Initially selected category array.
 * - searchKey: Current search keyword.
 * - setCurrentPage: Function to set the current page.
 * - setSearchCategory: Function to set the current category for search.
 */
const CategoriesFilter = ({
  categories,
  selectedCategory = [],
  searchKey,
  setCurrentPage,
  setSearchCategory,
}) => {
  // Local state for managing selected category (only one at a time).
  const [selectedCategories, setSelectedCategories] =
    useState(selectedCategory);
  // State for controlling mobile filter visibility.
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Router for navigation.
  const router = useRouter();

  /**
   * Handle change event for category checkbox.
   * Only one category can be selected at a time.
   */
  const handleCategoryChange = (e) => {
    if (e.target.checked) {
      setSelectedCategories([e.target.value]);
    } else {
      setSelectedCategories([]);
    }
  };

  // Update local selectedCategories whenever the selectedCategory prop changes.
  useEffect(() => {
    setSelectedCategories(selectedCategory);
  }, [selectedCategory]);

  /**
   * Handle apply action.
   * Build the URL for the recipes page based on selected options and navigate.
   */
  const handleApply = (e) => {
    e.preventDefault();
    // Set selected category, using the first element from selectedCategories.
    setSearchCategory(selectedCategories[0]);
    setCurrentPage(1);

    const url =
      `/recipes?page=1` +
      (searchKey ? `&search=${searchKey}` : "") +
      `&category=${selectedCategories[0] || ""}`;

    router.push(url);
  };

  /**
   * Handle clearing all filters
   */
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSearchCategory("");
    setCurrentPage(1);
    router.push(`/recipes?page=1${searchKey ? `&search=${searchKey}` : ""}`);
  };

  return (
    <>
      {/* Mobile view: Filter button */}
      <div className="lg:hidden fixed bottom-10 left-4 z-10">
        <Button
          className="rounded-full shadow-lg flex items-center gap-2 bg-white text-gray-800 hover:bg-gray-100 border border-gray-200"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Filter size={16} />
          <span>{isFilterOpen ? "Close" : "Filters"}</span>
          {selectedCategories.length > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {selectedCategories.length}
            </span>
          )}
        </Button>
      </div>

      {/* Desktop view: Sidebar filter */}
      <div className="hidden lg:block pt-20 w-[280px] p-4 bg-white min-h-full border-r">
        <div className="sticky top-20">
          {/* Header with title and clear button */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Categories</h3>
            {selectedCategories.length > 0 && (
              <button
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                onClick={handleClearFilters}
              >
                Clear
              </button>
            )}
          </div>

          {/* Categories list */}
          <div className="space-y-1 mb-8">
            {categories?.map((category, index) => (
              <div
                key={index}
                className={`flex items-center py-2 px-3 rounded-lg transition-colors ${
                  selectedCategories.includes(category.label)
                    ? "bg-blue-50"
                    : "hover:bg-gray-100"
                }`}
              >
                <input
                  id={`desktop-${category.label}`}
                  type="checkbox"
                  value={category.label}
                  checked={selectedCategories.includes(category.label)}
                  onChange={handleCategoryChange}
                  className="sr-only"
                />
                <label
                  htmlFor={`desktop-${category.label}`}
                  className={`flex flex-1 items-center cursor-pointer ${
                    selectedCategories.includes(category.label)
                      ? "font-medium text-blue-600"
                      : "text-gray-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center mr-3 ${
                      selectedCategories.includes(category.label)
                        ? "bg-blue-500 text-white"
                        : "border border-gray-300"
                    }`}
                  >
                    {selectedCategories.includes(category.label) && (
                      <Check size={12} strokeWidth={3} />
                    )}
                  </div>
                  {category.label}
                </label>
              </div>
            ))}
          </div>

          {/* Apply button */}
          <div className="flex justify-center">
            <Button
              className="w-full rounded-lg"
              disabled={
                selectedCategories.length === 0 && selectedCategory.length === 0
              }
              onClick={handleApply}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile view: Overlay filter modal */}
      {isFilterOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-60 z-50 backdrop-blur-sm transition-opacity">
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg max-h-[80vh] overflow-y-auto transition-transform">
            {/* Header */}
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-gray-800">Categories</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Categories grid */}
            <div className="p-4 grid grid-cols-2 gap-2">
              {categories?.map((category, index) => (
                <div
                  key={index}
                  className={`flex items-center p-2 rounded-lg border ${
                    selectedCategories.includes(category.label)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-200"
                  }`}
                >
                  <input
                    id={`mobile-${category.label}`}
                    type="checkbox"
                    value={category.label}
                    checked={selectedCategories.includes(category.label)}
                    onChange={handleCategoryChange}
                    className="sr-only"
                  />
                  <label
                    htmlFor={`mobile-${category.label}`}
                    className={`flex flex-1 items-center cursor-pointer ${
                      selectedCategories.includes(category.label)
                        ? "font-medium text-blue-600"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center mr-2 ${
                        selectedCategories.includes(category.label)
                          ? "bg-blue-500 text-white"
                          : "border border-gray-300"
                      }`}
                    >
                      {selectedCategories.includes(category.label) && (
                        <Check size={10} strokeWidth={3} />
                      )}
                    </div>
                    <span className="text-sm">{category.label}</span>
                  </label>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="p-4 flex gap-2 border-t sticky bottom-0 bg-white">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleClearFilters}
              >
                Clear
              </Button>
              <Button
                className="flex-1"
                onClick={(e) => {
                  handleApply(e);
                  setIsFilterOpen(false);
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoriesFilter;
