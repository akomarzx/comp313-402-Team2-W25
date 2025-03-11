import axios from "axios";
const recipeUrl = process.env.NEXT_PUBLIC_RECIPE_API;

/**
 * Fetch a single recipe by ID.
 * @param {string} recipeId - The unique recipe identifier.
 * @returns {object|number} The recipe data or an HTTP status code.
 */
export async function getRecipeById(recipeId) {
  try {
    const response = await axios.get(
      `${recipeUrl}/kc/v1/public/recipe/${recipeId}`,
      {
        withCredentials: true,
      }
    );
    return response.data.result;
  } catch (error) {
    if (error.response) {
      console.error("Error fetching recipe:", error.response.data);
      if (error.response.status === 401) {
        return error.response.status;
      }
    } else {
      console.error("Error fetching recipe:", error);
    }
  }
}

/**
 * Fetch multiple recipes with pagination, filtering, and sorting.
 * @param {number} page - Current page index (starting at 1).
 * @param {number} size - Number of items per page.
 * @param {string} search - Search query.
 * @param {Array} sort - Sorting parameters.
 * @param {string} category - Recipe category filter.
 * @returns {object} The resulting recipes data.
 */
export async function getRecipes(page, size, search = "", sort = [], category) {
  try {
    page = page < 1 ? 0 : page - 1;
    const url = `${recipeUrl}/kc/v1/public/recipe?size=${size}&page=${page}&search=${search}&sort=${sort}&category=${category}`;
    const response = await axios.get(url, { withCredentials: true });
    return response.data.result;
  } catch (error) {
    if (error.response) {
      console.error("Error fetching recipes:", error.response.data);
      if (error.response.status === 401) {
        return error.response.status;
      }
    } else {
      console.error("Error fetching recipes:", error);
    }
  }
}

/**
 * Create a new recipe.
 * @param {object} data - The recipe data to create.
 * @returns {object} The server response.
 */
export async function createRecipe(data) {
  try {
    const response = await axios.post(`${recipeUrl}/kc/v1/recipe`, data, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error("Error creating recipe:", error);
    if (error.status === 401) {
      window.location.href = "/";
    }
  }
}

/**
 * Generate a recipe via AI service.
 * @param {object} data - The data needed to generate a recipe.
 * @returns {object} The server response.
 */
export async function generateRecipe(data) {
  try {
    const response = await axios.post(
      `${recipeUrl}/kc/v1/recipe/ai-recipe-recommend`,
      data,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error generating recipe:", error);
    if (error.status === 401) {
      window.location.href = "/";
    }
  }
}

/**
 * Generate a meal plan via AI service.
 * @param {object} data - The data required for meal plan generation.
 * @returns {object} The server response.
 */
export async function generateMealPlan(data) {
  try {
    const response = await axios.post(
      `${recipeUrl}/kc/v1/meal-plan/ai-recommend`,
      data,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error generating meal plan:", error);
    if (error.status === 401) {
      window.location.href = "/";
    }
  }
}

/**
 * Upload an image to the server.
 * @param {FormData} data - Form data containing the image file.
 * @returns {object} The server response.
 */
export async function uploadImg(data) {
  try {
    const response = await axios.post(
      `${recipeUrl}/kc/v1/recipe/img-upload`,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error uploading image:", error);
    if (error.status === 401) {
      window.location.href = "/";
    }
  }
}

/**
 * Fetch the user's recipes.
 * @param {number} page - Current page index.
 * @returns {object} The user's recipes data.
 */
export async function getMyRecipes(page) {
  try {
    const response = await axios.get(
      `${recipeUrl}/kc/v1/recipe/my-recipe?size=12&page=${page}`,
      {
        withCredentials: true,
      }
    );
    return response.data.result;
  } catch (error) {
    console.error("Error fetching my recipes:", error);
    if (error.status === 401) {
      window.location.href = "/";
    }
  }
}

/**
 * Fetch the user's saved recipes.
 * @param {number} page - Current page index.
 * @returns {object} Saved recipes data.
 */
export async function getSavedRecipes(page) {
  try {
    const response = await axios.get(
      `${recipeUrl}/kc/v1/recipe/saved?size=12&page=${page}`,
      {
        withCredentials: true,
      }
    );
    return response.data.result;
  } catch (error) {
    console.error("Error fetching saved recipes:", error);
    if (error.status === 401) {
      window.location.href = "/";
    }
  }
}

/**
 * Fetch meal plans for the current user.
 * @param {number} page - Current page index.
 * @returns {object} The user's meal plans data.
 */
export async function getMealPlans(page) {
  try {
    const response = await axios.get(
      `${recipeUrl}/kc/v1/meal-plan/my-meal-plans?size=12&page=${page}`,
      {
        withCredentials: true,
      }
    );
    return response.data.result;
  } catch (error) {
    console.error("Error fetching saved recipes:", error);
    if (error.status === 401) {
      window.location.href = "/";
    }
  }
}

/**
 * Fetch a meal plan by ID.
 * @param {string} mealPlanId - The unique meal plan identifier.
 * @returns {object} The meal plan data.
 */
export async function getMealPlanById(mealPlanId) {
  try {
    const response = await axios.get(
      `${recipeUrl}/kc/v1/meal-plan/${mealPlanId}`,
      {
        withCredentials: true,
      }
    );
    return response.data.result;
  } catch (error) {
    console.error("Error fetching meal plan:", error);
    if (error.status === 401) {
      window.location.href = "/";
    }
  }
}

/**
 * Save a recipe.
 * @param {string} recipeId - The recipe identifier.
 * @returns {object} The server response.
 */
export async function saveRecipe(recipeId) {
  try {
    const response = await axios.post(
      `${recipeUrl}/kc/v1/recipe/save`,
      { recipeId },
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    console.error("Error saving recipe:", error);
  }
}

/**
 * Remove a saved recipe.
 * @param {string} recipeId - The recipe identifier.
 * @returns {object} The server response.
 */
export async function unsaveRecipe(recipeId) {
  try {
    const response = await axios.delete(
      `${recipeUrl}/kc/v1/recipe/save/${recipeId}`,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error unsaving recipe:", error);
    if (error.status === 401) {
      window.location.href = "/";
    }
  }
}

/**
 * Update a recipe by ID.
 * @param {string} recipeId - The recipe identifier.
 * @param {object} data - Updated recipe data.
 * @returns {object} The server response.
 */
export async function updateRecipe(recipeId, data) {
  try {
    const response = await axios.put(
      `${recipeUrl}/kc/v1/recipe/${recipeId}`,
      data,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating recipe:", error);
    if (error.status === 401) {
      window.location.href = "/";
    }
  }
}

/**
 * Update an ingredient group for a recipe.
 * @param {string} recipeId - The recipe identifier.
 * @param {string} ingredientGroupId - The ingredient group identifier.
 * @param {object} data - Updated ingredient group data.
 * @returns {object} The server response.
 */
export async function updateIngredientGroup(recipeId, ingredientGroupId, data) {
  try {
    const response = await axios.patch(
      `${recipeUrl}/kc/v1/recipe/${recipeId}/ingredient-group/${ingredientGroupId}`,
      data,
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    console.error("Error updating ingredients group:", error);
    if (error.status === 401) {
      window.location.href = "/";
    }
  }
}

/**
 * Update a step group for a recipe.
 * @param {string} recipeId - The recipe identifier.
 * @param {string} stepGroupId - The step group identifier.
 * @param {object} data - Updated step group data.
 * @returns {object} The server response.
 */
export async function updateStepGroup(recipeId, stepGroupId, data) {
  try {
    const response = await axios.patch(
      `${recipeUrl}/kc/v1/recipe/${recipeId}/step-group/${stepGroupId}`,
      data,
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    console.error("Error updating step group:", error);
    if (error.status === 401) {
      window.location.href = "/";
    }
  }
}

/**
 * Fetch a rating for a recipe.
 * @param {string} recipeId - The recipe identifier.
 * @param {boolean} isUser - Indicates if the request is for the current user's rating.
 * @returns {object} The rating data.
 */
export async function getRatingById(recipeId, isUser) {
  try {
    if (isUser) {
      const response = await axios.get(
        `${recipeUrl}/kc/v1/rating/my-rating/recipe/${recipeId}`,
        {
          withCredentials: true,
        }
      );
      return response.data.result;
    }
    const response = await axios.get(
      `${recipeUrl}/kc/v1/public/rating/recipe/${recipeId}`
    );
    return response.data.result;
  } catch (error) {
    console.error("Error fetching rating:", error);
  }
}

/**
 * Send or update a rating for a recipe.
 * @param {string} recipeId - The recipe identifier.
 * @param {number} data - The rating value.
 * @returns {object} The server response.
 */
export async function sendRating(recipeId, data) {
  try {
    const response = await axios.put(
      `${recipeUrl}/kc/v1/rating/${recipeId}`,
      { ratingValue: data },
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    console.error("Error sending rating:", error);
    if (error.status === 401) {
      window.location.href = "/";
    }
  }
}
