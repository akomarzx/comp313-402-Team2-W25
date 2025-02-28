package org.group2.comp313.kitchen_companion.dto.ai;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeDto;

import java.util.List;

public record AIMealPlanRecommendationResult(
        @JsonProperty("success") boolean success,
        @JsonProperty("reasonForFail") String reasonForFail,
        @JsonProperty("mealPlanWeek") List<MealPlanWeek> mealPlanWeek,
        @JsonProperty("mealPlanTitle") String mealPlanTitle
) {

    public record MealPlanWeek(
            @JsonProperty("mealPlanDay") List<MealPlanDay> mealPlanDays
    ) {}

    public record MealPlanDay(
            @JsonProperty("breakfastRecipeId") RecipeDto breakfastRecipe,
            @JsonProperty("lunchRecipeId") RecipeDto lunchRecipe,
            @JsonProperty("dinnerRecipeId") RecipeDto dinnerRecipe,
            @JsonProperty("breakfastRecipeSubstituteCd") int breakfastRecipeSubstituteCd,
            @JsonProperty("lunchRecipeSubstituteCd") int lunchRecipeSubstituteCd,
            @JsonProperty("dinnerRecipeSubstituteCd") int dinnerRecipeSubstituteCd,
            @JsonProperty("daysOfWeekCd") int daysOfWeekCd
    ){}
}