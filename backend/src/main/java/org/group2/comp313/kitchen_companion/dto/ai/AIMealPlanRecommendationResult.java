package org.group2.comp313.kitchen_companion.dto.ai;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeDto;

import java.util.List;

public record AIMealPlanRecommendationResult(
        @JsonProperty("success") boolean success,
        @JsonProperty("reasonForFail") String reasonForFail,
        @JsonProperty("mealPlanDays") List<MealPlanDay> mealPlanDays,
        @JsonProperty("mealPlanTitle") String mealPlanTitle
) {

    public record MealPlanDay(
            @JsonProperty("breakfastRecipe") RecipeDto breakfastRecipe,
            @JsonProperty("lunchRecipe") RecipeDto lunchRecipe,
            @JsonProperty("dinnerRecipe") RecipeDto dinnerRecipe,
            @JsonProperty("breakfastRecipeSubstituteCd") int breakfastRecipeSubstituteCd,
            @JsonProperty("lunchRecipeSubstituteCd") int lunchRecipeSubstituteCd,
            @JsonProperty("dinnerRecipeSubstituteCd") int dinnerRecipeSubstituteCd,
            @JsonProperty("daysOfWeekCd") int daysOfWeekCd
    ){}
}