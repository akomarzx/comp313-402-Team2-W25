package org.group2.comp313.kitchen_companion.domain.projection;

import java.time.Instant;
import java.util.Set;

public interface MealPlanSummary {

    Integer getId();
    String getLabel();
    String getCreatedBy();
    Instant getCreatedAt();

    Set<MealPlanGroupSummary> getMealPlanGroups();

    interface MealPlanGroupSummary {
        Integer getId();
        String getLabel();
        Set<MealPlanDaySummary> getMealPlanDays();
    }

    interface MealPlanDaySummary {
        Integer getId();

        RecipeSummary getBreakfastRecipe();
        CodeValueSummary getBreakfastRecipeSubstituteCd();

        RecipeSummary getLunchRecipe();
        CodeValueSummary getLunchRecipeSubstituteCd();

        RecipeSummary getDinnerRecipe();
        CodeValueSummary getDinnerRecipeSubstituteCd();

        Integer getDayOfWeekCode();
    }

    interface RecipeSummary {
        Integer getId();
        String getTitle();
    }

    interface CodeValueSummary {
        Integer getId();
        String getLabel();
    }
}
