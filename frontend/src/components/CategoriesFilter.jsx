import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

const CategoriesFilter = ({ categories, selectedCategory = [], searhKey }) => {
  const [selectedCategories, setSelectedCategories] =
    useState(selectedCategory);
  console.log(searhKey);
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
  useEffect(() => {}, [selectedCategories]);
  useEffect(() => {
    setSelectedCategories(selectedCategory);
  }, [selectedCategory]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter();
  return (
    <>
      <div className="lg:hidden fixed bottom-10 left-4 z-10">
        <Button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="rounded-full shadow-lg"
        >
          {isFilterOpen ? "Close" : "Filters"}
        </Button>
      </div>

      <div className="hidden lg:block pt-20 w-[320px] p-4 bg-white min-h-full border-r-2">
        <div className="sticky top-20">
          <div className="text-lg font-bold ">
            Categories{" "}
            {/* {selectedCategories.length > 0 && (
            <span
              className="text-sm font-normal underline cursor-pointer"
              onClick={() => setSelectedCategories([])}
            >
              (Clear)
            </span>
          )} */}
          </div>
          <div className="mt-4">
            {categories?.map((category, index) => (
              <div
                key={index}
                className="flex my-2"
                onChange={handleCategoryChange}
              >
                <input
                  id={category.label}
                  type="checkbox"
                  value={category.label}
                  checked={selectedCategories.includes(category.label)}
                  className="text-sm text-center"
                  onChange={handleCategoryChange}
                />
                <label
                  className="pl-3 text-left hover:font-semibold cursor-pointer "
                  htmlFor={category.label}
                >
                  {category.label}
                </label>
              </div>
            ))}
            <div className="text-center">
              <Button
                className="rounded-lg w-20 h-10"
                onClick={() => {
                  router.push(
                    `/recipes?page=${1}&search=${searhKey}&category=${
                      selectedCategories[0] || ""
                    }`
                  );
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isFilterOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed bottom-10 left-0 right-0 bg-white rounded-t-xl p-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-2">
              <div className="text-lg font-bold">
                Categories{" "}
                {/* {selectedCategories.length > 0 && (
                  <span
                    className="text-sm font-normal underline cursor-pointer"
                    onClick={() => setSelectedCategories([])}
                  >
                    (Clear)
                  </span>
                )} */}
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
                    className="pl-2 text-left hover:font-semibold cursor-pointer text-sm"
                    htmlFor={`mobile-${category.label}`}
                  >
                    {category.label}
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(false)}
                className="w-[48%]"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  router.push(
                    `/recipes?page=1&category=${selectedCategories[0] || ""}`
                  );
                  setIsFilterOpen(false);
                }}
                className="w-[48%]"
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
