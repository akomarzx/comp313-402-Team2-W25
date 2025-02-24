package org.group2.comp313.kitchen_companion.dto.ai;

import java.util.List;

public record AIMealPlanRecommendationRequest(
        String goalOrPurpose,
        List<String> mealPreferences,
        List<String> allergiesAndRestrictions
) {
}
