import axios from "axios";
const recipeUrl = process.env.NEXT_PUBLIC_RECIPE_API;
export async function getRecipeById(recipeId) {
  try {
    const recipe = await axios.get(`${recipeUrl}/kc/v1/recipe/${recipeId}`);
    return recipe.data.result;
  } catch (error) {
    if (error.response) {
      console.log("Error fetching recipe:", error.response.data);
      if (error.response.status === 401) {
        return error.response.status;
      }
    } else {
      console.log("Error fetching recipe:", error);
    }
  }
}

export async function getRecipes(page, size) {
  try {
    const recipes = await axios.get(
      `${recipeUrl}/kc/v1/recipe?size=${size}&page=${page}`
    );
    console.log(recipes.data.result);
    return recipes.data.result;
  } catch (error) {
    if (error.response) {
      console.log("Error fetching recipes:", error.response.data);
      if (error.response.status === 401) {
        return error.response.status;
      }
    } else {
      console.log("Error fetching recipes:", error);
    }
  }
}

export async function createRecipe(data) {
  console.log(data);
  try {
    const recipeResponse = await axios.post(`${recipeUrl}/kc/v1/recipe`, data, {
      withCredentials: true,
    });
    return recipeResponse;
  } catch (error) {
    console.log("Error creating recipe:", error);
  }
}
