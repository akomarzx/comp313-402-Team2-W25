package org.group2.comp313.kitchen_companion.repository;

import org.group2.comp313.kitchen_companion.domain.Category;
import org.group2.comp313.kitchen_companion.domain.Recipe;
import org.group2.comp313.kitchen_companion.domain.projection.RecipeSummaryForCards;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeSummaryCardWithCategory;
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

    @Query(value = "SELECT r.recipe_id AS id, r.title, r.summary AS description, r.thumbnail_url AS thumbnailUrl, " +
            "GROUP_CONCAT(c.label SEPARATOR ',') AS category " +
            "FROM recipe r " +
            "LEFT JOIN recipe_category rc ON r.recipe_id = rc.recipe_id " +
            "LEFT JOIN category c ON rc.category_id = c.category_id " +
            "GROUP BY r.recipe_id, r.title, r.summary, r.thumbnail_url",
            countQuery = "SELECT COUNT(*) FROM recipe",
            nativeQuery = true)
    Page<RecipeSummaryCardWithCategory> findAllRecipeSummaryCards(Pageable pageable);

}