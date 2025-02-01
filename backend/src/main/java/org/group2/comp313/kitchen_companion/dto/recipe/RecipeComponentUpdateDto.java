package org.group2.comp313.kitchen_companion.dto.recipe;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record RecipeComponentUpdateDto(
        @NotNull Integer id,
        @Nullable @Size(max = 255) String label,
        @Nullable @Size(min = 1) List<ComponentUpdateDto> componentUpdateDtoList
) {
}
