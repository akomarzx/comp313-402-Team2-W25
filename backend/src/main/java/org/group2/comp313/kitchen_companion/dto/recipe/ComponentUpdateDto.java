package org.group2.comp313.kitchen_companion.dto.recipe;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;

public record ComponentUpdateDto(
        @NotNull Integer id,
        @Nullable String label,
        @Nullable String imageUrl
){}