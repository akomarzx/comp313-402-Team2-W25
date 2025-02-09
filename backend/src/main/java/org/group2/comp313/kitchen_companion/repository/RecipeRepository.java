package org.group2.comp313.kitchen_companion.repository;

import org.group2.comp313.kitchen_companion.domain.Category;
import org.group2.comp313.kitchen_companion.domain.Recipe;
import org.group2.comp313.kitchen_companion.domain.projection.RecipeSummaryForCards;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.Set;

public interface RecipeRepository extends PagingAndSortingRepository<Recipe, Integer>, CrudRepository<Recipe, Integer>, JpaSpecificationExecutor<Recipe> {
    Page<RecipeSummaryForCards> findAllBy(Pageable pageable);
    Page<RecipeSummaryForCards> findAllByCreatedByOrderByIdDesc(String createdBy, Pageable pageable);
    Optional<Recipe> findByIdAndCreatedBy(Integer id, String createdBy);

    @Query("SELECT c FROM Recipe r JOIN r.categories c WHERE r.id = :recipeId")
    Set<Category> findCategoriesByRecipeId(@Param("recipeId") Integer recipeId);
}