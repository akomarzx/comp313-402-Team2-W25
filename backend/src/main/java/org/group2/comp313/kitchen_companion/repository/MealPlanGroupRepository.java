package org.group2.comp313.kitchen_companion.repository;

import jakarta.validation.constraints.NotNull;
import org.group2.comp313.kitchen_companion.domain.MealPlanGroup;
import org.group2.comp313.kitchen_companion.dto.meal_plan.MealPlanGroupSummaryDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface MealPlanGroupRepository extends JpaRepository<MealPlanGroup, Integer>, JpaSpecificationExecutor<MealPlanGroup> {
    Integer countByMealPlan(@NotNull Integer mealPlan);

    List<MealPlanGroup> findAllByMealPlan(@NotNull Integer mealPlan);
}