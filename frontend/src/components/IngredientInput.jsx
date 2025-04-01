import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

/**
 * IngredientInput Component
 *
 * Renders an input field to add ingredients. Displays added ingredients with an option to remove them.
 *
 * Props:
 * - ingredients (array): Current list of ingredients.
 * - setIngredients (function): State setter to update the ingredient list.
 */
const IngredientInput = ({ ingredients, setIngredients }) => {
  // Local state for the current ingredient input
  const [currentIngredient, setCurrentIngredient] = React.useState("");

  // Add current ingredient to the list if it's not empty
  const handleAddIngredient = () => {
    const trimmedIngredient = currentIngredient.trim();
    if (trimmedIngredient) {
      setIngredients([...ingredients, trimmedIngredient]);
      setCurrentIngredient("");
    }
  };

  // Listen for Enter key press to add ingredient
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  // Remove ingredient at provided index
  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Input and Add Button */}
      <div className="flex">
        <Input
          type="text"
          placeholder="Type an ingredient and press Enter..."
          value={currentIngredient}
          onChange={(e) => setCurrentIngredient(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 border border-gray-200 rounded-r-none focus-visible:ring-1 focus-visible:ring-blue-500"
        />
        <Button
          onClick={handleAddIngredient}
          type="button"
          className="rounded-l-none bg-blue-50 hover:bg-blue-100 text-blue-600 border border-gray-200 border-l-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Display Added Ingredients */}
      <div className="flex flex-wrap gap-2">
        {ingredients.length === 0 ? (
          <div className="text-xs text-gray-500 py-1">
            No ingredients added yet
          </div>
        ) : (
          ingredients.map((ingredient, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 bg-gray-50 text-gray-800 px-2 py-1 rounded text-xs"
            >
              {ingredient}
              <button
                onClick={() => removeIngredient(index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Remove ingredient"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))
        )}
      </div>
    </div>
  );
};

export default IngredientInput;
