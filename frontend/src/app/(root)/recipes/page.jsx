"use client";
import React, { useEffect, useState } from "react";
import RecipesResult from "@/components/RecipesResult";
import { getRecipes } from "@/api/recipe";
import { buttonVariants } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import RecipeCarousel from "@/components/RecipeCarousel";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { ArrowBigUp, Search } from "lucide-react";
import CategoriesFilter from "@/components/CategoriesFilter";

const RecipePage = () => {
  // Authentication & context data
  const { user, logout, loading, categories, topRecipes } = useAuth();

  // URL search params
  const searchParams = useSearchParams();
  const displayType = searchParams.get("displayType") || "default";
  let page = searchParams.get("page") || 1;
  const sortParam = searchParams.get("sort") || "default";
  const searchKeyParam = searchParams.get("search") || "";
  const categoryKeyParam = searchParams.get("category") || "";

  // Validate page param
  if (typeof page !== "number") {
    try {
      page = parseInt(page);
      if (isNaN(page)) redirect("/recipes");
    } catch (error) {
      redirect("/recipes");
    }
  }

  // Internal states
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recipeCardData, setRecipeCardData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(parseInt(page));
  const [searchKey, setSearchKey] = useState(searchKeyParam);
  const [searchCategory, setSearchCategory] = useState(categoryKeyParam);
  const [searchInput, setSearchInput] = useState(searchKeyParam);
  const router = useRouter();

  // Helper array for pagination items
  let pages = [1, 2, 3];

  // Fetch recipes from API
  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      const fetchData = await getRecipes(
        currentPage,
        12,
        searchKey,
        [sortParam?.split("-")],
        searchCategory
      );

      // Handle authorization
      if (fetchData === 401) {
        logout();
        toast("Session expired. Please login again.");
        setTimeout(() => router.push("/"), 2000);
        return;
      }

      // Update UI states
      setRecipeCardData(fetchData?.content);
      setTotalPages(fetchData?.page?.totalPages);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch recipes on parameter changes
  useEffect(() => {
    fetchRecipes();
  }, [currentPage, searchKey, sortParam, searchCategory]);

  // Update currentPage if page param changes
  useEffect(() => {
    if (page !== currentPage) setCurrentPage(page);
  }, [page]);

  // Handle search by "Enter" key
  const handleSearch = (e) => {
    if (e?.key === "Enter") {
      if (e?.target?.value.length < 3) {
        toast("Search key must be at least 3 characters long.");
      } else {
        setSearchKey(e.target.value);
        router.push(`/recipes?search=${e.target.value}&page=1&category=`);
        setCurrentPage(1);
        setSearchCategory("");
      }
    }
  };

  // Handle search button click
  const handleSearchClick = () => {
    if (searchInput.length < 3) {
      toast("Search key must be at least 3 characters long.");
    } else {
      setSearchKey(searchInput);
      router.push(`/recipes?search=${searchInput}&page=1&category=`);
      setCurrentPage(1);
      setSearchCategory("");
    }
  };

  // Build pagination pages
  if (currentPage === 1) {
    if (totalPages > 3) pages = [1, 2, 3];
    else if (totalPages === 2) pages = [1, 2];
    else pages = [1];
  } else if (currentPage === totalPages) {
    if (totalPages > 3) pages = [totalPages - 2, totalPages - 1, totalPages];
    else if (totalPages === 2) pages = [1, 2];
    else pages = [1];
  } else {
    pages = [currentPage - 1, currentPage, currentPage + 1];
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="fade-in">
          {/* Top recipes carousel */}
          <RecipeCarousel data={topRecipes?.data.slice(0, 10)} />
        </div>

        {/* Search box */}
        <div className="mx-auto max-w-2xl mb-12">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
            What are you craving today?
          </h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for recipes, ingredients, or cuisines..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearch}
              disabled={isLoading}
              className="w-full h-14 px-6 py-4 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400"
            />
            <button
              onClick={handleSearchClick}
              disabled={isLoading}
              className="absolute right-2 top-2 h-10 w-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories filter */}
          {!loading && recipeCardData && (
            <CategoriesFilter
              categories={categories?.data}
              selectedCategory={[searchCategory] || []}
              setSearchCategory={setSearchCategory}
              setCurrentPage={setCurrentPage}
              searchKey={searchKey}
            />
          )}

          {/* Recipes results */}
          <div className="flex-1">
            <RecipesResult
              isSearching={isSearching}
              recipeCardData={recipeCardData}
              displayType={displayType}
              isLoading={isLoading}
              sort={sortParam}
              searchKey={searchKey}
              user={user}
              selectedCategory={[categoryKeyParam] || []}
            />

            {/* Pagination */}
            {!isLoading && totalPages > 1 && currentPage <= totalPages && (
              <Pagination className="my-10">
                <PaginationContent className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                  {/* Previous button */}
                  <PaginationItem>
                    <PaginationPrevious
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(
                          `/recipes?page=${
                            currentPage > 1 ? currentPage - 1 : 1
                          }&sort=${sortParam}&search=${searchKey}&category=${
                            categoryKeyParam || ""
                          }`
                        );
                        setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
                      }}
                      className={`rounded-none ${
                        currentPage === 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-50"
                      }`}
                    />
                  </PaginationItem>

                  {/* Page numbers */}
                  {pages.map((pageNum) => {
                    const isActive = pageNum === currentPage;
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href=""
                          className={cn(
                            {
                              [buttonVariants({
                                variant: "default",
                                className:
                                  "hover:!text-primary-foreground rounded-none",
                              })]: isActive,
                            },
                            "rounded-none border-none"
                          )}
                          isActive={isActive}
                          onClick={(e) => {
                            router.push(
                              `/recipes?page=${pageNum}&sort=${sortParam}&search=${searchKey}&category=${
                                categoryKeyParam || ""
                              }`
                            );
                            e.preventDefault();
                            setCurrentPage(pageNum);
                          }}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  {/* Next button */}
                  <PaginationItem>
                    <PaginationNext
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(
                          `/recipes?page=${
                            currentPage < totalPages
                              ? currentPage + 1
                              : totalPages
                          }&sort=${sortParam}&search=${searchKey}&category=${
                            categoryKeyParam || ""
                          }`
                        );
                        setCurrentPage((prev) =>
                          prev < totalPages ? prev + 1 : prev
                        );
                      }}
                      className={`rounded-none ${
                        currentPage === totalPages
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-50"
                      }`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}

            {/* Back to top button */}
            <div className="fixed bottom-10 right-10 z-10">
              <button
                className="bg-white text-gray-600 p-3 rounded-full shadow-md hover:shadow-lg transition-all border border-gray-200 hover:bg-gray-50"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                aria-label="Scroll to top"
              >
                <ArrowBigUp size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipePage;
