package org.group2.comp313.kitchen_companion.dto.recipe;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.group2.comp313.kitchen_companion.annotation.ValidateCodeID;

import java.math.BigDecimal;

public record UpdateRecipeDTO(
        @NotNull Integer id,
        @Size(min = 1, max = 256) String title,
        @Size(max = 255) String summary,
        Integer prepTime,
        Integer prepTimeUnitCd,
        Integer cookTime,
        Integer cookTimeUnitCd,
        Integer servings,
        @Size(max = 255) String yield,
        @Size(max = 500) String imageUrl,
        @Size(max = 500) String thumbnailUrl
        //@DecimalMin(value = "0.0") BigDecimal calories,
        //@DecimalMin(value = "0.0") BigDecimal carbsG,
        //@DecimalMin(value = "0.0") BigDecimal sugarsG,
        //@DecimalMin(value = "0.0") BigDecimal fatG
) {
}
