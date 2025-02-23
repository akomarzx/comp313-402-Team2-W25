package org.group2.comp313.kitchen_companion.repository;

import org.group2.comp313.kitchen_companion.domain.MealPlan;
import org.group2.comp313.kitchen_companion.domain.projection.MealPlanSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MealPlanRepository extends JpaRepository<MealPlan, Integer>, JpaSpecificationExecutor<MealPlan> {
    Optional<MealPlanSummary> findOneProjectedById(Integer id);
}