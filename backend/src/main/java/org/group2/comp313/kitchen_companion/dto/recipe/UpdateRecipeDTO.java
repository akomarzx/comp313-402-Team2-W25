package org.group2.comp313.kitchen_companion.dto.recipe;

import jakarta.annotation.Nullable;
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
        @Nullable @Min(0) Integer prepTime,
        @Nullable @ValidateCodeID(codeTypeName = "TIME_UNIT") Integer prepTimeUnitCd,
        @Nullable @Min(0) Integer cookTime,
        @Nullable @ValidateCodeID(codeTypeName = "TIME_UNIT") Integer cookTimeUnitCd,
        @Nullable Integer servings,
        @Size(max = 255) String yield,
        @Size(max = 500) String imageUrl,
        @Size(max = 500) String thumbnailUrl,
        @Nullable @DecimalMin(value = "0.0") BigDecimal calories,
        @Nullable @DecimalMin(value = "0.0") BigDecimal carbsG,
        @Nullable @DecimalMin(value = "0.0") BigDecimal sugarsG,
        @Nullable @DecimalMin(value = "0.0") BigDecimal fatG
) {
}
