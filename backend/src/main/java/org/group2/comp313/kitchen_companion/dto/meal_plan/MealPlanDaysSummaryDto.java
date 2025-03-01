package org.group2.comp313.kitchen_companion.dto.meal_plan;

import org.group2.comp313.kitchen_companion.domain.Recipe;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeSummaryForCards;

public record MealPlanDaysSummaryDto(
        Integer id,
        Integer mealPlanGroupId,
        String breakfastSubstituteLabel,
        Recipe breakfastRecipe,
        String lunchSubstituteLabel,
        Recipe lunchRecipe,
        String dinnerSubstituteLabel,
        Recipe dinnerRecipe,
        Integer daysOfWeekCd,
        String dayOfWeekLabel
) {
}
