package org.group2.comp313.kitchen_companion.dto.recipe;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.group2.comp313.kitchen_companion.annotation.ValidateCodeID;

import java.math.BigDecimal;
import java.util.List;

public record RecipeDTO(
        @NotNull @Size(min = 1, max = 256) String title,
        @Size(max = 255) String summary,
        @NotNull @Min(1) int prepTime,
        @NotNull @ValidateCodeID(codeTypeName = "TIME_UNIT") int prepTimeUnitCd,
        @NotNull @Min(1) int cookTime,
        @NotNull @ValidateCodeID(codeTypeName = "TIME_UNIT") int cookTimeUnitCd,
        @NotNull @Min(1) int servings,
        @Size(max = 255) String yield,
        @Size(max = 500) String imageUrl,
        @Size(max = 500) String thumbnailUrl,
        @NotNull @DecimalMin(value = "0.0") BigDecimal calories,
        @NotNull @DecimalMin(value = "0.0") BigDecimal carbsG,
        @NotNull @DecimalMin(value = "0.0") BigDecimal sugarsG,
        @NotNull @DecimalMin(value = "0.0") BigDecimal fatG,
        @NotNull @Size(min = 1) List<@NotNull Integer> categoryIds,
        @NotNull @Size(min = 1) List<@Valid IngredientGroupDTO> ingredientGroups,
        @NotNull @Size(min = 1) List<@Valid StepGroupDTO> stepGroups
) {
}
