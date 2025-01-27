import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

const RecipeCarousel = ({ data }) => {
  const router = useRouter();
  console.log(data);
  return (
    <>
      <h2 className="font-semibold text-2xl text-center p-2">
        Top Pick of the Week
      </h2>
      <Carousel
        opts={{
          align: "start",
        }}
        className=" max-w-sm md:max-w-xl  lg:max-w-3xl  2xl:max-w-4xl mx-auto"
      >
        <CarouselContent>
          {data?.map((item, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="">
                <Card className="border-none ">
                  <CardContent className="flex aspect-square items-center justify-center p-2">
                    <div className="relative w-[300px] h-[200px] rounded-md overflow-hidden">
                      {" "}
                      <Image
                        src={
                          item?.thumbnailUrl ||
                          "https://www.themealdb.com/images/media/meals/58oia61564916529.jpg"
                        }
                        alt={item?.title}
                        fill
                        sizes="100%"
                        className="rounded-t-lg cursor-pointer"
                        onClick={() => router.push(`/recipe/${item.id}`)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
};

export default RecipeCarousel;
