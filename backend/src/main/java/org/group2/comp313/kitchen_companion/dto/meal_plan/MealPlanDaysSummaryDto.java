package org.group2.comp313.kitchen_companion.dto.meal_plan;

import org.group2.comp313.kitchen_companion.dto.recipe.RecipeSummaryForCards;

public record MealPlanDaysSummaryDto(
        Integer id,
        Integer mealPlanGroupId,
        String breakfastSubstituteLabel,
        RecipeSummaryForCards breakfastRecipeSummary,
        String lunchSubstituteLabel,
        RecipeSummaryForCards lunchRecipeSummary,
        String dinnerSubstituteLabel,
        RecipeSummaryForCards dinnerRecipeSummary,
        Integer daysOfWeekCd,
        String dayOfWeekLabel
) {
}
