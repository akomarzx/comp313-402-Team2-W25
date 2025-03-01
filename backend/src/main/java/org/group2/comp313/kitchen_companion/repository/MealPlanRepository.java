package org.group2.comp313.kitchen_companion.repository;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.group2.comp313.kitchen_companion.domain.MealPlan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface MealPlanRepository extends JpaRepository<MealPlan, Integer>, JpaSpecificationExecutor<MealPlan> {

    Page<MealPlan> findAllByCreatedBy(@Size(max = 256) @NotNull String createdBy, Pageable pageable);
}