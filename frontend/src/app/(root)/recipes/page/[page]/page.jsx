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
import { redirect, useParams, useRouter } from "next/navigation";
import { BarLoader } from "react-spinners";

const RecipePage = () => {
  let { page } = useParams();
  if (page === undefined) {
    page = 1;
  }

  if (typeof page !== "number") {
    try {
      page = parseInt(page);
      if (isNaN(page)) {
        redirect("/recipes/1");
      }
    } catch (error) {
      console.error("Error parsing page:", error);
      redirect("/recipes/1");
    }
  }
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recipeCardData, setRecipeCardData] = useState([]);
  const [data, setData] = useState({});
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(parseInt(page));
  const router = useRouter();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true); // Set loading to true
        const fetchData = await getRecipes(currentPage, 10); // Fetch data
        setData(fetchData); // Set the main data state
        setRecipeCardData(fetchData?.content); // Update the recipe card data
        setTotalPages(fetchData?.page?.totalPages); // Uncomment if total pages logic is required
        console.log(fetchData); // Log the fetched data
      } catch (error) {
        console.error("Error fetching recipes:", error); // Handle errors gracefully
      } finally {
        setIsLoading(false); // Set loading to false regardless of success/failure
      }
    };
    fetchRecipes();
  }, [currentPage]);

  const handleSearch = (e) => {
    e?.key === "Enter" && setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 2000);
  };

  let pages = [1, 2, 3];
  if (currentPage === 1) {
    pages = [1, 2, 3];
  } else {
    pages = [currentPage - 1, currentPage, currentPage + 1];
  }

  return (
    <div className="py-10">
      <div className="mx-auto max-w-[600px] mb-5">
        <h3 className="font-semibold text-normal p-2">
          What are you craving for today?
        </h3>
        <input
          type="text"
          placeholder="Search recipes..."
          className="border p-2 w-full rounded-full "
          onKeyDownCapture={handleSearch}
        />
      </div>

      <div className="border-t-2">
        {!isLoading ? (
          <>
            <RecipesResult
              isSearching={isSearching}
              recipeCardData={recipeCardData}
            />

            <Pagination>
              <PaginationContent className="gap-0 border mt-8 rounded-lg divide-x overflow-hidden">
                <PaginationItem>
                  <PaginationPrevious
                    href={`/recipes/page/${
                      currentPage > 1 ? currentPage - 1 : 1
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(
                        `/recipes/page/${currentPage > 1 ? currentPage - 1 : 1}`
                      );
                      setCurrentPage((prev) => {
                        if (prev > 1) {
                          return prev - 1;
                        }
                        return prev;
                      });
                      console.log(totalPages);
                    }}
                    className="rounded-none cursor-pointer"
                  />
                </PaginationItem>
                {pages.map((page) => {
                  const isActive = page === currentPage;

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href={`/recipes/page/${page}`}
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
                          router.push(`/recipes/page/${page}`);
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    href={`/recipes/page/${
                      currentPage < totalPages ? currentPage + 1 : totalPages
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(
                        `/recipes/page/${
                          currentPage < totalPages
                            ? currentPage + 1
                            : totalPages
                        }`
                      );
                      setCurrentPage((prev) => {
                        if (prev < totalPages) {
                          return prev + 1;
                        }
                        return prev;
                      });
                      console.log(totalPages);
                    }}
                    className="rounded-none cursor-pointer"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        ) : (
          <div className="mx-auto text-center mt-40">
            <BarLoader className="mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipePage;
