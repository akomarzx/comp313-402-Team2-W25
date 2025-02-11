package org.group2.comp313.kitchen_companion.dto.ai;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeDto;

public record AIRecipeRecommendationResult(
        @JsonProperty("success") Boolean success,
        @JsonProperty("reasonForFail") String reasonForFail,
        @JsonProperty("recipe") RecipeDto recipe
) {
}
