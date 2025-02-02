package org.group2.comp313.kitchen_companion.dto.recipe;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.group2.comp313.kitchen_companion.utility.ValidationGroups;

public record StepDTO(
        @NotNull(groups = ValidationGroups.Update.class) Integer id,
        @NotNull @Min(0) int stepOrder,
        @NotNull @Size(min = 1, max = 255) String label,
        @Size(max = 500) String imageUrl
) {}
