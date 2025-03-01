import React, { useState, useRef, useEffect } from "react";
import {
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  Scale,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

const MealPlanRecipe = ({ recipe }) => {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);
  const router = useRouter();
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (expanded && contentRef.current) {
      contentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [expanded]);

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border overflow-hidden mb-6 transform transition-all duration-300 ${
        expanded ? "shadow-md" : ""
      }`}
      ref={contentRef}
    >
      <div className="relative">
        <div
          className="h-32 overflow-hidden transition-all duration-500 ease-in-out"
          style={{
            height: expanded ? "220px" : "100px",
          }}
        >
          <img
            src={recipe?.imageUrl}
            alt={recipe?.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out"
            style={{
              transform: expanded ? "scale(1.05)" : "scale(1)",
            }}
          />
        </div>

        <div
          className={`absolute inset-0 bg-gradient-to-t ${
            expanded
              ? "from-black/50 to-transparent"
              : "from-black/60 to-transparent"
          } transition-opacity duration-500`}
        ></div>

        <div className="absolute bottom-0 left-0 p-4 w-full">
          <div className="flex items-start justify-between">
            <h2 className="text-white font-semibold text-xl tracking-tight leading-tight">
              {recipe.title}
            </h2>
            <button
              className="p-1 rounded-full bg-white/90 hover:bg-white transition-colors duration-200"
              onClick={toggleExpand}
              aria-label={expanded ? "Collapse recipe" : "Expand recipe"}
            >
              {expanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="flex space-x-3 mt-2">
            {recipe?.categories?.map((cat, i) => (
              <span key={i}>
                <span className="text-blue-600 border rounded-full px-2 bg-blue-100 text-xs">
                  {cat.label}
                </span>
                &nbsp;{" "}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        className={expanded ? "recipe-card-expanded" : "recipe-card-collapsed"}
      >
        <div className="p-4">
          <p className=" mb-4 line-clamp-1">{recipe.summary}</p>

          <div className="flex justify-between items-center mb-4 text-sm ">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{recipe.prepTime} prep</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{recipe.cookTime} cook</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>Serves {recipe.servings}</span>
            </div>
            <div className="flex items-center">
              <Scale className="h-4 w-4 mr-1" />
              <span>{recipe.calories} cal</span>
            </div>
          </div>

          <div className="recipe-divider"></div>

          <div>
            <h3 className="font-medium  mb-2">Ingredients</h3>
            <ol className="list list-inside text-gray-700">
              {recipe?.ingredientGroups
                .sort((a, b) => a.ingredientGroupOrder - b.ingredientGroupOrder)
                .map((ingredientGroup, index) => (
                  <li key={index} className="mb-4">
                    <h3 className="font-semibold text-lg">
                      {ingredientGroup.label}
                    </h3>
                    <ul className="list-disc list-inside text-gray-700">
                      {ingredientGroup.ingredients
                        .sort((a, b) => a.ingredientOrder - b.ingredientOrder)
                        .map((ingredient, index) => (
                          <li key={index}>{ingredient.label}</li>
                        ))}
                    </ul>
                  </li>
                ))}
            </ol>
          </div>

          <div className="recipe-divider"></div>

          <div>
            <h3 className="font-medium  mb-2">Instructions</h3>
            <ol className="list list-inside text-gray-700 space-y-2">
              {recipe?.stepGroups
                .sort((a, b) => a.stepGroupOrder - b.stepGroupOrder)
                .map((stepGroup, index) => (
                  <li key={index} className="mb-4">
                    <h3 className="font-semibold text-lg">{stepGroup.label}</h3>
                    <ol className="list-decimal list-inside text-gray-700">
                      {stepGroup.steps
                        .sort((a, b) => a.stepOrder - b.stepOrder)
                        .map((step, index) => (
                          <li key={index}>{step.description || step.label}</li>
                        ))}
                    </ol>
                  </li>
                ))}
            </ol>
          </div>
        </div>
        <div className="justify-end flex p-4">
          <div
            onClick={() => {
              router.push(`/recipe/${recipe.id}`);
            }}
            className="cursor-pointer  flex border-t justify-around items-center rounded-full  w-[150px] hover:bg-gray-100"
          >
            <span>Go to details</span> <ArrowRight size={20} className="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanRecipe;
