"use client";

import React, { useState } from "react";

import { redirect, useSearchParams } from "next/navigation";

import { RotateLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import RecipeList from "@/components/RecipeList";
import { useAuth } from "@/context/AuthContext";

const AIRecipies = () => {
  const router = useRouter();
  const { user } = useAuth();
  if (!user) {
    redirect("/");
  }
  const searchParams = useSearchParams();
  const data = JSON.parse(searchParams.get("data") || "{}");

  const [isQuerying, setIsQuerying] = useState(true);
  const [recipeCardData, setRecipeCardData] = useState([]);
  React.useEffect(() => {
    console.log(data);
    router.push("/ai-rcmd/recipes");
    const timer = setTimeout(() => {
      setRecipeCardData([
        {
          id: "1",
          title: "Creamy Mushroom Pasta",
          description:
            "A delicious vegetarian pasta dish with sautéed mushrooms in a creamy sauce.",
          cookingTime: "30 mins",
          difficulty: "Easy",
          image:
            "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        },
        {
          id: "2",
          title: "Grilled Chicken Salad",
          description:
            "Fresh and healthy salad with grilled chicken breast and mixed greens.",
          cookingTime: "25 mins",
          difficulty: "Easy",
          image:
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        },
        {
          id: "3",
          title: "Vegetable Stir-Fry",
          description:
            "Quick and easy vegetable stir-fry with your choice of protein.",
          cookingTime: "20 mins",
          difficulty: "Medium",
          image:
            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        },
        {
          id: "4",
          title: "Mediterranean Quinoa Bowl",
          description:
            "Healthy quinoa bowl with fresh vegetables and feta cheese.",
          cookingTime: "35 mins",
          difficulty: "Easy",
          image:
            "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        },
        {
          id: "5",
          title: "Spicy Thai Curry",
          description:
            "Aromatic Thai curry with coconut milk and fresh vegetables.",
          cookingTime: "45 mins",
          difficulty: "Medium",
          image:
            "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        },
        {
          id: "6",
          title: "Classic Beef Burger",
          description: "Juicy homemade beef burger with all the trimmings.",
          cookingTime: "30 mins",
          difficulty: "Medium",
          image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        },
      ]);
      setIsQuerying(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="py-10">
      <div>
        {searchParams && isQuerying ? (
          <div className="mx-auto text-center mt-40">
            <p className="mb-10">
              {" "}
              Our AI is cooking up your repies please wait ...
            </p>
            <RotateLoader></RotateLoader>
          </div>
        ) : (
          <RecipeList recipeListData={recipeCardData} />
        )}
      </div>
    </div>
  );
};

export default AIRecipies;
