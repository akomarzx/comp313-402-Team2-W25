import axios from "axios";
const recipeUrl = process.env.NEXT_PUBLIC_RECIPE_API;

export async function getRecipeById(recipeId) {
  const recipe = await axios.get(`${recipeUrl}/kc/v1/recipe/${recipeId}`);
  console.log(recipe.data);
  return recipe.data;
}

export async function getRecipes(page, size) {
  const recipes = await axios.get(
    `${recipeUrl}/kc/v1/recipe?size=${size}&page=${page}`
  );
  return recipes.data;
}

export async function createRecipe(data) {
  const recipe = await axios.post(`${recipeUrl}/kc/v1/recipe`, data);

  return NextResponse.json(recipe.data);
}
