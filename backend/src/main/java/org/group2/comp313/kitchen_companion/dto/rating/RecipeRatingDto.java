package org.group2.comp313.kitchen_companion.dto.rating;

import java.math.BigDecimal;

public record RecipeRatingDto(
        BigDecimal ratingValue,
        Long numberOfRatings,
        BigDecimal currentUserRating,
        Integer ratingIdForUser
) {
}
