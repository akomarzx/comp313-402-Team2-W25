package org.group2.comp313.kitchen_companion.repository;

import org.group2.comp313.kitchen_companion.domain.MealPlanGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MealPlanGroupRepository extends JpaRepository<MealPlanGroup, Integer>, JpaSpecificationExecutor<MealPlanGroup> {
}