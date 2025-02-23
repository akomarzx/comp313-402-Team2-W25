package org.group2.comp313.kitchen_companion.repository;

import org.group2.comp313.kitchen_companion.domain.MealPlanDay;
import org.group2.comp313.kitchen_companion.dto.meal_plan.MealPlanDaysSummaryDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MealPlanDayRepository extends JpaRepository<MealPlanDay, Integer>, JpaSpecificationExecutor<MealPlanDay> {

    @Query(" SELECT new org.group2.comp313.kitchen_companion.dto.meal_plan.MealPlanDaysSummaryDto(" +
            "   mpd.id, " +
            "   mpd.mealPlanGroup," +
            "   bscv.label," +
            "   new org.group2.comp313.kitchen_companion.dto.recipe.RecipeSummaryForCards(br.id, br.title, null, br.thumbnailUrl, br.calories)," +
            "   lscv.label," +
            "   new org.group2.comp313.kitchen_companion.dto.recipe.RecipeSummaryForCards(lr.id, lr.title, null, lr.thumbnailUrl, lr.calories)," +
            "   dscv.label," +
            "   new org.group2.comp313.kitchen_companion.dto.recipe.RecipeSummaryForCards(dr.id, dr.title, null, dr.thumbnailUrl, dr.calories)," +
            "   mpd.dayOfWeekCode," +
            "   dowcd.label" +
            ") " +
            "FROM " +
            "   MealPlanDay as mpd left join Recipe as br on mpd.breakfastRecipe = br.id left join " +
            "   Recipe as lr on mpd.lunchRecipe = lr.id left join " +
            "   Recipe as dr on mpd.dinnerRecipe = dr.id left join " +
            "   CodeValue as bscv on mpd.breakfastRecipeSubstituteCd = bscv.id left join " +
            "   CodeValue as lscv on mpd.lunchRecipeSubstituteCd = lscv.id left join " +
            "   CodeValue as dscv on mpd.dinnerRecipeSubstituteCd = dscv.id left join " +
            "   CodeValue as dowcd on mpd.dayOfWeekCode = dowcd.id " +
            "where mpd.mealPlanGroup = :mealPlanGroupId"
    )
    List<MealPlanDaysSummaryDto> findMealPlanDaySummaryDtoByMealPlanGroup(@Param("mealPlanGroupId")Integer mealPlanGroupId);
}