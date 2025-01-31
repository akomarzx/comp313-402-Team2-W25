package org.group2.comp313.kitchen_companion.dto.ai;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record AIRecipeRecommendationRequest(
        @NotNull @Size(min = 3) List<String> ingredientList,
        List<String> mealPreferences,
        List<String> allergiesAndRestrictions
) {
}
