package org.group2.comp313.kitchen_companion.dto.ai;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import java.util.List;

public record AIMealPlanRecommendationRequest(
        @Min(1) @Max(4) Integer numberOfWeeks,
        String goalOrPurpose,
        List<String> mealPreferences,
        List<String> allergiesAndRestrictions
) {
}
