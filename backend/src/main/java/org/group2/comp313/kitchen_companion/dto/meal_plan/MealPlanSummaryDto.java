package org.group2.comp313.kitchen_companion.dto.meal_plan;

import java.time.Instant;
import java.util.List;

public record MealPlanSummaryDto(
        Integer id,
        String label,
        Instant createdAt,
        String createdBy,
        List<MealPlanGroupSummaryDto> mealPlanGroupSummaryDtoList
) {
}
