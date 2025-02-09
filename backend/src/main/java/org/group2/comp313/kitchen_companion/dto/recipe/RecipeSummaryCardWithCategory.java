package org.group2.comp313.kitchen_companion.dto.recipe;

public record RecipeSummaryCardWithCategory(
        Integer id,
        String title,
        String description,
        String thumbnailUrl,
        String category
) {
}
