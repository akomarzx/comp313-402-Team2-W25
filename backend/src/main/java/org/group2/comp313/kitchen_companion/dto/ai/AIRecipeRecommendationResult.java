package org.group2.comp313.kitchen_companion.dto.ai;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.Nullable;
import jakarta.validation.Valid;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeDto;

public record AIRecipeRecommendationResult(
        @JsonProperty("success") Boolean success,
        @JsonProperty("reasonForFail") String reasonForFail,
        @Valid @Nullable @JsonProperty("recipe") RecipeDto recipe
) {
}
