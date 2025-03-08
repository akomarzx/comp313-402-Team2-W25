package org.group2.comp313.kitchen_companion.dto;

import jakarta.validation.constraints.NotNull;

public record UserInteractionDto(
        @NotNull String sessionId,
        @NotNull Integer recipeId,
        @NotNull String eventType
) {
}
