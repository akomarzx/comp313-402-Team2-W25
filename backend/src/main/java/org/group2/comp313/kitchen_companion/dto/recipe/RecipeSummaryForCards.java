package org.group2.comp313.kitchen_companion.dto.recipe;

public record RecipeSummaryForCards(
    Integer id,
    String title,
    String summary,
    String thumbnailUrl
) {
}
