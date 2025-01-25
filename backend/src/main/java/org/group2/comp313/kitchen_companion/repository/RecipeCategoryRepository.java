package org.group2.comp313.kitchen_companion.repository;

import org.group2.comp313.kitchen_companion.domain.RecipeCategory;
import org.group2.comp313.kitchen_companion.domain.RecipeCategoryId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface RecipeCategoryRepository extends JpaRepository<RecipeCategory, RecipeCategoryId>, JpaSpecificationExecutor<RecipeCategory> {
}