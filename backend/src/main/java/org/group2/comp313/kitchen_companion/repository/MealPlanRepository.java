package org.group2.comp313.kitchen_companion.repository;

import org.group2.comp313.kitchen_companion.domain.MealPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MealPlanRepository extends JpaRepository<MealPlan, Integer>, JpaSpecificationExecutor<MealPlan> {
}