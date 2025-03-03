import axios from "axios";
const recipeUrl = process.env.NEXT_PUBLIC_RECIPE_API;
export async function getRecipeById(recipeId) {
  try {
    const recipe = await axios.get(
      `${recipeUrl}/kc/v1/public/recipe/${recipeId}`,
      {
        withCredentials: true,
      }
    );
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

export async function getRecipes(page, size, search = "", sort = [], category) {
  console.log(category);
  try {
    if (page < 0) {
      page = 0;
    } else {
      page -= 1;
    }
    const recipes = await axios.get(
      `${recipeUrl}/kc/v1/public/recipe?size=${size}&page=${page}&search=${search}&sort=${sort}&category=${category}`,
      {
        withCredentials: true,
      }
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

export async function generateRecipe(data) {
  console.log(data);
  try {
    const recipeResponse = await axios.post(
      `${recipeUrl}/kc/v1/recipe/ai-recipe-recommend`,
      data,
      {
        withCredentials: true,
      }
    );
    return recipeResponse;
  } catch (error) {
    console.log("Error generating recipe:", error);
  }
}

export async function generateMealPlan(data) {
  console.log(data);
  try {
    const mealPlanResponse = await axios.post(
      `${recipeUrl}/kc/v1/meal-plan/ai-recommend`,
      data,
      {
        withCredentials: true,
      }
    );
    return mealPlanResponse;
  } catch (error) {
    console.log("Error generating meal plan:", error);
  }
}

export async function uploadImg(data) {
  try {
    const imgResponse = await axios.post(
      `${recipeUrl}/kc/v1/recipe/img-upload`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    return imgResponse;
  } catch (error) {
    console.log("Error uploading image:", error);
  }
}

export async function getMyRecipes(page) {
  try {
    console.log(page);
    const recipes = await axios.get(
      `${recipeUrl}/kc/v1/recipe/my-recipe?size=${12}&page=${page}`,
      {
        withCredentials: true,
      }
    );
    console.log(recipes.data.result);
    return recipes.data.result;
  } catch (error) {
    console.log("Error fetching my recipes:", error);
  }
}

export async function getSavedRecipes(page) {
  try {
    console.log(page);
    const recipes = await axios.get(
      `${recipeUrl}/kc/v1/recipe/saved?size=${12}&page=${page}`,
      {
        withCredentials: true,
      }
    );
    console.log(recipes);
    return recipes.data.result;
  } catch (error) {
    console.log("Error fetching saved recipes:", error);
  }
}

export async function getMealPlans(page) {
  try {
    console.log(page);
    const mealPlans = await axios.get(
      `${recipeUrl}/kc/v1/meal-plan/my-meal-plans?size=${12}&page=${page}`,
      {
        withCredentials: true,
      }
    );
    console.log(mealPlans);
    return mealPlans.data.result;
  } catch (error) {
    console.log("Error fetching saved recipes:", error);
  }
}

export async function getMealPlanById(mealPlanId) {
  try {
    const mealPlan = await axios.get(
      `${recipeUrl}/kc/v1/meal-plan/${mealPlanId}`,
      {
        withCredentials: true,
      }
    );
    return mealPlan.data.result;
  } catch (error) {
    console.log("Error fetching meal plan:", error);
  }
}

export async function saveRecipe(recipeId) {
  try {
    const recipeResponse = await axios.post(
      `${recipeUrl}/kc/v1/recipe/save`,
      { recipeId: recipeId },
      {
        withCredentials: true,
      }
    );
    return recipeResponse;
  } catch (error) {
    console.log("Error saving recipe:", error);
  }
}

export async function unsaveRecipe(recipeId) {
  try {
    const recipeResponse = await axios.delete(
      `${recipeUrl}/kc/v1/recipe/save/${recipeId}`,
      {
        withCredentials: true,
      }
    );
    return recipeResponse;
  } catch (error) {
    console.log("Error unsaving recipe:", error);
  }
}

export async function updateRecipe(recipeId, data) {
  try {
    const recipeResponse = await axios.put(
      `${recipeUrl}/kc/v1/recipe/${recipeId}`,
      data,
      {
        withCredentials: true,
      }
    );
    return recipeResponse;
  } catch (error) {
    console.log("Error updating recipe:", error);
  }
}

export async function updateIngredientGroup(recipeId, ingredientGroupId, data) {
  try {
    const recipeResponse = await axios.patch(
      `${recipeUrl}/kc/v1/recipe/${recipeId}/ingredient-group/${ingredientGroupId}`,
      data,
      {
        withCredentials: true,
      }
    );
    return recipeResponse;
  } catch (error) {
    console.log("Error updating ingredients group:", error);
  }
}

export async function updateStepGroup(recipeId, stepGroupId, data) {
  try {
    const recipeResponse = await axios.patch(
      `${recipeUrl}/kc/v1/recipe/${recipeId}/step-group/${stepGroupId}`,
      data,
      {
        withCredentials: true,
      }
    );
    return recipeResponse;
  } catch (error) {
    console.log("Error updating step group:", error);
  }
}

export async function getRatingById(recipeId, isUser) {
  try {
    if (isUser) {
      const rating = await axios.get(
        `${recipeUrl}/kc/v1/rating/my-rating/recipe/${recipeId}`,
        {
          withCredentials: true,
        }
      );
      console.log(rating.data.result);
      return rating.data.result;
    }
    const rating = await axios.get(
      `${recipeUrl}/kc/v1/public/rating/recipe/${recipeId}`
    );
    return rating.data.result;
  } catch (error) {
    console.log("Error fetching rating:", error);
  }
}

export async function sendRating(recipeId, data) {
  try {
    const ratingResponse = await axios.put(
      `${recipeUrl}/kc/v1/rating/${recipeId}`,
      { ratingValue: data },
      {
        withCredentials: true,
      }
    );
    return ratingResponse;
  } catch (error) {
    console.log("Error sending rating:", error);
  }
}
