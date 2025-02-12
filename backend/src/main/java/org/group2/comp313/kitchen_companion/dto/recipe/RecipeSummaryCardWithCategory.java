package org.group2.comp313.kitchen_companion.dto.recipe;

import java.math.BigDecimal;

public record RecipeSummaryCardWithCategory(
        Integer id,
        String title,
        String description,
        String thumbnailUrl,
        Long ratingCount,
        BigDecimal ratingValue,
        String category
) {
}
