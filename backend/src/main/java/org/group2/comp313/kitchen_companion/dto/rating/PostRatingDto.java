package org.group2.comp313.kitchen_companion.dto.rating;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record PostRatingDto(
        @NotNull @DecimalMin(value = "0.0") @DecimalMax(value = "5.0") BigDecimal ratingValue
) {
}
