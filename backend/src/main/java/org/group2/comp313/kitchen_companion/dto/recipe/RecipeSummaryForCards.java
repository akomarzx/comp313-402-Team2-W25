package org.group2.comp313.kitchen_companion.dto.recipe;

import java.math.BigDecimal;

public record RecipeSummaryForCards(
    Integer id,
    String title,
    String summary,
    String thumbnailUrl,
    BigDecimal calories
) {
}
