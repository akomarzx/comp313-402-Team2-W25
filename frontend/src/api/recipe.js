import axios from "axios";
const recipeUrl = process.env.NEXT_PUBLIC_RECIPE_API;
export async function getRecipeById(recipeId) {
  try {
    const recipe = await axios.get(
      `${recipeUrl}/kc/v1/public/recipe/${recipeId}`
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

export async function getRecipes(page, size) {
  try {
    const recipes = await axios.get(
      `${recipeUrl}/kc/v1/public/recipe?size=${size}&page=${page}`
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
      `${recipeUrl}/kc/v1/recipe/my-recipe?size=${10}&page=${page}`,
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
