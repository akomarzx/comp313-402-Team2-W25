import axios from "axios";
const recipeUrl = process.env.NEXT_PUBLIC_RECIPE_API;
import { useAuth } from "@/context/AuthContext";
export async function getRecipeById(recipeId) {
  const { logout } = useAuth();
  try {
    const recipe = await axios.get(`${recipeUrl}/kc/v1/recipe/${recipeId}`);
    console.log(recipe.data);
    return recipe.data;
  } catch (error) {
    if (error.response) {
      console.error("Error fetching recipe:", error.response.data);
      if (error.response.status === 401) {
        logout();

        return null;
      }
    } else {
      console.error("Error fetching recipe:", error.message);
    }
  }
}

export async function getRecipes(page, size) {
  const { logout } = useAuth();
  try {
    const recipes = await axios.get(
      `${recipeUrl}/kc/v1/recipe?size=${size}&page=${page}`
    );
    console.log(recipe.data);
    return recipes.data;
  } catch (error) {
    if (error.response) {
      console.error("Error fetching recipes:", error.response.data);
      if (error.response.status === 401) {
        logout();

        return null;
      }
    } else {
      console.error("Error fetching recipes:", error.message);
    }
  }
}

export async function createRecipe(data) {
  const recipe = await axios.post(`${recipeUrl}/kc/v1/recipe`, data);

  return recipe.data;
}
