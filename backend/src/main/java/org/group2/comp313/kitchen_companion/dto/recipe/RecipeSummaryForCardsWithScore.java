package org.group2.comp313.kitchen_companion.dto.recipe;

import java.math.BigDecimal;

public record RecipeSummaryForCardsWithScore(
    Integer id,
    String title,
    String thumbnailUrl,
    BigDecimal calories,
    Long userInteractionScore
) {
}
