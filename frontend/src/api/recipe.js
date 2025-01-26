import { NextResponse } from "next/server";

const bffUrl = process.env.NEXT_PUBLIC_NODE_API;

export async function getRecipeById(recipeId) {
  const recipe = await axios.get(`${bffUrl}/api/recipe/${recipeId}`, {
    withCredentials: true,
  });

  return NextResponse.json(recipe.data);
}

export async function getRecipes() {
  const recipes = await axios.get(`${bffUrl}/api/recipes`, {
    withCredentials: true,
  });

  return NextResponse.json(recipes.data);
}

export async function createRecipe(data) {
  const recipe = await axios.post(`${bffUrl}/api/recipes`, data, {
    withCredentials: true,
  });

  return NextResponse.json(recipe.data);
}
