package org.group2.comp313.kitchen_companion.dto.recipe;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateRecipeGroupDTO(
        @NotNull Integer id,
        @NotNull @Size(min = 1, max = 255) String label,
        @Size(max = 500) String imageUrl
) {
}
