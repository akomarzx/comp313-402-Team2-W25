import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

// UI components
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

/*
  RecipeCarousel Component
  Renders a carousel for displaying recipe cards with images.
*/
const RecipeCarousel = ({ data }) => {
  const router = useRouter();

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="mb-12 mt-4">
      {/* Section Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Top Picks of the Week
        </h2>
        <p className="text-gray-500 mt-2">
          Discover our most popular and highly-rated recipes
        </p>
      </div>

      {/* Carousel Container */}
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="max-w-[280px] md:max-w-2xl lg:max-w-4xl 2xl:max-w-6xl mx-auto"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {/* Iterate over data to create carousel items */}
          {data?.map((item, index) => (
            <CarouselItem
              key={index}
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 2xl:basis-1/4"
            >
              <div className="h-full">
                <Card
                  className="border-none shadow-sm hover:shadow-md transition-all duration-300 h-full bg-transparent overflow-hidden rounded-xl"
                  onClick={() => router.push(`/recipe/${item.id}`)}
                >
                  <CardContent className="relative p-0 aspect-[4/3] h-full group cursor-pointer">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative w-full h-full overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
                          <Image
                            unoptimized
                            src={
                              item?.thumbnailUrl ||
                              "https://www.themealdb.com/images/media/meals/58oia61564916529.jpg"
                            }
                            alt={item?.title}
                            fill
                            sizes="100%"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                            <h3 className="text-white font-semibold text-lg line-clamp-2">
                              {item?.title}
                            </h3>
                            {item?.category && (
                              <div className="flex mt-2 gap-1">
                                <span className="text-xs font-medium text-white bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                                  {item?.category?.split(",")[0]?.trim()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        className="font-semibold max-w-[230px]"
                        side="right"
                      >
                        {item?.title}
                      </TooltipContent>
                    </Tooltip>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Carousel Navigation */}
        <CarouselPrevious className="hidden sm:flex -left-4 md:-left-6 shadow-md border-none bg-white/80 hover:bg-white">
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </CarouselPrevious>
        <CarouselNext className="hidden sm:flex -right-4 md:-right-6 shadow-md border-none bg-white/80 hover:bg-white">
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </CarouselNext>
      </Carousel>

      {/* Indicator dots for smaller screens */}
      <div className="flex justify-center mt-4 sm:hidden">
        {data.slice(0, Math.min(5, data.length)).map((_, index) => (
          <div key={index} className="w-2 h-2 rounded-full bg-gray-300 mx-1" />
        ))}
      </div>
    </div>
  );
};

export default RecipeCarousel;
