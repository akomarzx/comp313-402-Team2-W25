package org.group2.comp313.kitchen_companion.repository;

import org.group2.comp313.kitchen_companion.domain.IngredientGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface IngredientGroupRepository extends JpaRepository<IngredientGroup, Integer>, JpaSpecificationExecutor<IngredientGroup> {
}