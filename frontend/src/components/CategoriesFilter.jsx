import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
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
    // if (e.target.checked) {
    //   setSelectedCategories([...selectedCategories, e.target.value]);
    // } else {
    //   setSelectedCategories(
    //     selectedCategories.filter((category) => category !== e.target.value)
    //   );
    // }
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

  return (
    <>
      {/* Mobile view: Filter button */}
      <div className="lg:hidden fixed bottom-10 left-4 z-10">
        <Button
          className="rounded-full shadow-lg"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          {isFilterOpen ? "Close" : "Filters"}
        </Button>
      </div>

      {/* Desktop view: Sidebar filter */}
      <div className="hidden lg:block pt-20 w-[320px] p-4 bg-white min-h-full border-r-2">
        <div className="sticky top-20">
          <div className="text-lg font-bold">
            Categories
            {/* Uncomment below block to add "Clear" functionality */}
            {/*
            {selectedCategories.length > 0 && (
              <span
                className="text-sm font-normal underline cursor-pointer"
                onClick={() => setSelectedCategories([])}
              >
                (Clear)
              </span>
            )}
            */}
          </div>
          <div className="mt-4">
            {categories?.map((category, index) => (
              <div key={index} className="flex my-2">
                <input
                  id={category.label}
                  type="checkbox"
                  value={category.label}
                  checked={selectedCategories.includes(category.label)}
                  className="text-sm text-center"
                  onChange={handleCategoryChange}
                />
                <label
                  htmlFor={category.label}
                  className="pl-3 text-left hover:font-semibold cursor-pointer"
                >
                  {category.label}
                </label>
              </div>
            ))}
            <div className="text-center">
              <Button className="rounded-lg w-20 h-10" onClick={handleApply}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile view: Overlay filter modal */}
      {isFilterOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed bottom-10 left-0 right-0 bg-white rounded-t-xl p-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-2">
              <div className="text-lg font-bold">
                Categories
                {/* Uncomment below block to add "Clear" functionality */}
                {/*
                {selectedCategories.length > 0 && (
                  <span
                    className="text-sm font-normal underline cursor-pointer"
                    onClick={() => setSelectedCategories([])}
                  >
                    (Clear)
                  </span>
                )}
                */}
              </div>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-xl"
              >
                <X />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {categories?.map((category, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    id={`mobile-${category.label}`}
                    type="checkbox"
                    value={category.label}
                    checked={selectedCategories.includes(category.label)}
                    className="text-sm"
                    onChange={handleCategoryChange}
                  />
                  <label
                    htmlFor={`mobile-${category.label}`}
                    className="pl-2 text-left hover:font-semibold cursor-pointer text-sm"
                  >
                    {category.label}
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between">
              <Button
                variant="outline"
                className="w-[48%]"
                onClick={() => setIsFilterOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="w-[48%]"
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
