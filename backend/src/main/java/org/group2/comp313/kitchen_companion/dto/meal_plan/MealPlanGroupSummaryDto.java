package org.group2.comp313.kitchen_companion.dto.meal_plan;

import java.util.List;

public record MealPlanGroupSummaryDto(
        Integer id,
        String label,
        List<MealPlanDaysSummaryDto> mealPlanDaysSummaryDtoList
) {
}
