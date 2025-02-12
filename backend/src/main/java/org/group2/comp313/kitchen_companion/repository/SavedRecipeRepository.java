package org.group2.comp313.kitchen_companion.repository;

import org.group2.comp313.kitchen_companion.domain.Recipe;
import org.group2.comp313.kitchen_companion.domain.SavedRecipe;
import org.group2.comp313.kitchen_companion.domain.projection.RecipeSummaryForCards;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedRecipeRepository extends JpaRepository<SavedRecipe, Integer> {

    Optional<SavedRecipe> findOneByRecipeAndCreatedBy(Integer recipeId, String createdBy);
}