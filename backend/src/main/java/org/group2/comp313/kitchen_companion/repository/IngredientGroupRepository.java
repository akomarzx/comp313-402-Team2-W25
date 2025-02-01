package org.group2.comp313.kitchen_companion.repository;

import org.group2.comp313.kitchen_companion.domain.IngredientGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface IngredientGroupRepository extends JpaRepository<IngredientGroup, Integer>, JpaSpecificationExecutor<IngredientGroup> {
    Optional<IngredientGroup> findByIdAndRecipeAndCreatedBy(Integer id, Integer recipe, String createdBy);
}