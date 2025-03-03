package org.group2.comp313.kitchen_companion.dto.meal_plan;

import jakarta.annotation.Nullable;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.group2.comp313.kitchen_companion.annotation.ValidateCodeID;
import org.group2.comp313.kitchen_companion.utility.ValidationGroups;

import java.util.List;

/**
 * DTO for creating a new meal plan.
 * This record represents the main structure of a meal plan,
 * containing a label and a list of meal plan groups.
 * This is used for creating meal plan from UI
 */
public record CreateMealPlanDto(
        String label,
        @Size(min = 1, max = 4) List<@Valid CreateMealPlanGroupSummary> mealPlanGroupSummaryDtoList
) {
    public record CreateMealPlanGroupSummary(
            @Size(min = 1) List<@Valid CreateMealPlanDaysSummary> mealPlanDaysSummaryDtoList
    ) {}

    public record CreateMealPlanDaysSummary(
            @Nullable @ValidateCodeID(codeTypeName = "SUBSTITUTION_CODE") Integer breakfastSubstituteCode,
            @Nullable Integer breakfastRecipeId,
            @Nullable @ValidateCodeID(codeTypeName = "SUBSTITUTION_CODE") Integer lunchSubstituteCode,
            @Nullable Integer lunchRecipeId,
            @Nullable @ValidateCodeID(codeTypeName = "SUBSTITUTION_CODE") Integer dinnerSubstituteCode,
            @Nullable Integer dinnerRecipeId,
            @NotNull(groups = ValidationGroups.Update.class) Integer daysOfWeekCd
    ) {}

}


