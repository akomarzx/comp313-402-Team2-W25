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
import { ArrowBigUp } from "lucide-react";

const RecipePage = () => {
  const { user, logout } = useAuth();
  const searchParams = useSearchParams();
  const displayType = searchParams.get("displayType") || "default";
  let page = searchParams.get("page") || 1;

  if (typeof page !== "number") {
    try {
      page = parseInt(page);
      if (isNaN(page)) {
        redirect("/recipes");
      }
    } catch (error) {
      console.error("Error parsing page:", error);
      redirect("/recipes");
    }
  }
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recipeCardData, setRecipeCardData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(parseInt(page));
  const router = useRouter();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        const fetchData = await getRecipes(currentPage, 10);
        if (fetchData === 401) {
          logout();
          toast("Session expired. Please login again.");
          setTimeout(() => {
            router.push("/");
          }, 2000);
          return;
        }
        setRecipeCardData(fetchData?.content);
        setTotalPages(fetchData?.page?.totalPages);
        console.log(fetchData);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setIsLoading(false);
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
      <div>
        {!isLoading && <RecipeCarousel data={recipeCardData?.slice(0, 5)} />}
      </div>
      <div className="mx-auto max-w-[600px] mb-5">
        <h3 className="font-semibold text-normal p-2 mt-6">
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
        <>
          <RecipesResult
            isSearching={isSearching}
            recipeCardData={recipeCardData}
            displayType={displayType}
            isLoading={isLoading}
          />
          {/* add a jump to top button */}
          <ArrowBigUp
            size={50}
            className="fixed bottom-10 right-10 2xl:right-[100px] p-2 bg-white text-gray-600 rounded-full cursor-pointer"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
          {!isLoading && (
            <Pagination>
              <PaginationContent className="gap-0 border mt-8 rounded-lg divide-x overflow-hidden">
                <PaginationItem>
                  <PaginationPrevious
                    href=""
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(
                        `/recipes?page=${currentPage > 1 ? currentPage - 1 : 1}`
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
                          router.push(`/recipes?page=${page}`);
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
                    href=""
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(
                        `/recipes?page=${
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
          )}
        </>
      </div>
    </div>
  );
};

export default RecipePage;
