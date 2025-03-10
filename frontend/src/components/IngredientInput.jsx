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
      handleAddIngredient();
    }
  };

  // Remove ingredient at provided index
  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Input and Add Button */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Type an ingredient and press Enter..."
          value={currentIngredient}
          onChange={(e) => setCurrentIngredient(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 border-2 border-purple-100 focus:border-purple-300 focus:ring-purple-200"
        />
        <Button
          onClick={handleAddIngredient}
          variant="outline"
          className="px-3 border-2 border-purple-100 hover:bg-purple-50 hover:border-purple-200"
        >
          <Plus className="h-4 w-4 text-purple-600" />
        </Button>
      </div>

      {/* Display Added Ingredients */}
      <div className="flex flex-wrap gap-2">
        {ingredients.map((ingredient, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-800 px-4 py-1.5 rounded-full text-sm font-medium group hover:bg-purple-100 transition-colors"
          >
            {ingredient}
            <button
              onClick={() => removeIngredient(index)}
              className="hover:text-pink-600 transition-colors"
              aria-label="Remove ingredient"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default IngredientInput;
