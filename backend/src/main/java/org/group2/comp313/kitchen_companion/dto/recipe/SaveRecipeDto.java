package org.group2.comp313.kitchen_companion.dto.recipe;

import jakarta.validation.constraints.NotNull;

public record SaveRecipeDto(
        @NotNull Integer recipeId
) {
}
