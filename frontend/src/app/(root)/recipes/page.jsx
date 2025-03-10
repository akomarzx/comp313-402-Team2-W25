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
    const searchBox = document.querySelector("input[name=searchBox]");
    if (searchBox?.value?.length < 3) {
      toast("Search key must be at least 3 characters long.");
    } else {
      setSearchKey(searchBox.value);
      router.push(`/recipes?search=${searchBox.value}&page=1&category=`);
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
    <div className="py-10 px max-w-[80%] mx-auto bg-white min-h-lvh transition-all duration-300">
      <div className="fade-in">
        {/* Top recipes carousel */}
        <RecipeCarousel data={topRecipes?.data.slice(0, 10)} />
      </div>

      {/* Search box */}
      <div className="mx-auto max-w-[600px] mb-5">
        <h3 className="font-semibold text-normal p-4 mt-6">
          What are you craving for today?
        </h3>
        <div className="flex px-2">
          <input
            type="text"
            placeholder="Search recipes..."
            name="searchBox"
            className="border p-2 w-full rounded-full"
            onKeyDownCapture={handleSearch}
            disabled={isLoading}
          />
          <button>
            <Search
              size={20}
              className="align-center mx-2"
              onClick={handleSearchClick}
            />
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="border-t-2 flex-col lg:flex-row flex w-full">
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
        <div className="w-full">
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
            <Pagination>
              <PaginationContent className="gap-0 border mt-8 rounded-lg divide-x overflow-hidden">
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
                    className="rounded-none cursor-pointer"
                  />
                </PaginationItem>

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
                              className: "hover:!text-primary-foreground",
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
                    className="rounded-none cursor-pointer"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}

          {/* Scroll to top arrow */}
          <ArrowBigUp
            size={50}
            className="fixed bottom-10 right-5 md:right-10 2xl:right-[100px] p-2 bg-white text-gray-600 rounded-full cursor-pointer z-20"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          />
        </div>
      </div>
    </div>
  );
};

export default RecipePage;
