package org.group2.comp313.kitchen_companion.repository;

import org.group2.comp313.kitchen_companion.domain.Category;
import org.group2.comp313.kitchen_companion.domain.Recipe;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeSummaryCardWithCategory;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeSummaryForCards;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeSummaryForCardsWithScore;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface RecipeRepository extends PagingAndSortingRepository<Recipe, Integer>, CrudRepository<Recipe, Integer>, JpaSpecificationExecutor<Recipe> {

    Page<RecipeSummaryForCards> findAllByCreatedByOrderByIdDesc(String createdBy, Pageable pageable);

    Optional<Recipe> findByIdAndCreatedBy(Integer id, String createdBy);

    @Query("SELECT c FROM Recipe r JOIN r.categories c WHERE r.id = :recipeId")
    Set<Category> findCategoriesByRecipeId(@Param("recipeId") Integer recipeId);

    /**
     * Finds a paginated list of recipe summary cards, including their categories,
     * based on the provided search keyword. The results are sorted according to the {@link Pageable} parameter.
     * If the keyword is null or empty, all recipes are retrieved.
     *
     * @param keyword the search keyword to match against the recipe titles and summaries;
     *                if null or empty, all recipes are included.
     * @param pageable the pagination and sorting information.
     * @return a paginated list of {@link RecipeSummaryCardWithCategory} that matches the search criteria.
     */
    @Query(
            value = "SELECT * FROM ( " +
                    "  SELECT r.recipe_id AS id, " +
                    "         r.title, " +
                    "         r.summary AS description, " +
                    "         r.thumbnail_url AS thumbnailUrl, " +
                    "         CAST(IFNULL(r_calc.rating_count, 0) AS UNSIGNED) AS ratingCount, " +
                    "         CAST(IFNULL(r_calc.rating_value, 0.0) AS DECIMAL(4,2)) AS rating, " +
                    "         GROUP_CONCAT(DISTINCT c.label SEPARATOR ', ') AS category, " +
                    "         IF(sr.saved_recipe_id IS NOT NULL, 1, 0) AS isFavorite " +
                    "  FROM recipe r " +
                    "       LEFT JOIN recipe_category rc ON r.recipe_id = rc.recipe_id " +
                    "       LEFT JOIN category c ON rc.category_id = c.category_id " +
                    "       LEFT JOIN rating_calculated r_calc ON r.recipe_id = r_calc.recipe_id " +
                    "       LEFT JOIN saved_recipe sr ON r.recipe_id = sr.recipe_id AND sr.created_by = :username " +
                    "  WHERE (:keyword IS NULL OR :keyword = '' " +
                    "         OR MATCH(r.title, r.summary) AGAINST(:keyword IN NATURAL LANGUAGE MODE)) " +
                    "        AND (:category IS NULL OR :category = '' OR c.label = :category) " +
                    "  GROUP BY r.recipe_id, r.title, r.summary, r.thumbnail_url, " +
                    "           r_calc.rating_count, r_calc.rating_value " +
                    ") AS x",
            countQuery = "SELECT COUNT(*) FROM ( " +
                    "  SELECT r.recipe_id " +
                    "  FROM recipe r " +
                    "       LEFT JOIN recipe_category rc ON r.recipe_id = rc.recipe_id " +
                    "       LEFT JOIN category c ON rc.category_id = c.category_id " +
                    "  WHERE (:keyword IS NULL OR :keyword = '' " +
                    "         OR MATCH(r.title, r.summary) AGAINST(:keyword IN NATURAL LANGUAGE MODE)) " +
                    "        AND (:category IS NULL OR :category = '' OR c.label = :category) " +
                    "  GROUP BY r.recipe_id " +
                    ") AS countTable",
            nativeQuery = true)
    Page<RecipeSummaryCardWithCategory> findRecipeSummaryCardsByKeywordAndSort(
            @Param("keyword") String keyword,
            @Param("username") String username,
            @Param("category") String category,
            Pageable pageable);


    @Query(value = "SELECT r.recipe_id as id, r.title, r.summary, r.thumbnail_url, r.calories " +
            "FROM recipe r LEFT JOIN saved_recipe sr ON r.recipe_id = sr.recipe_id " +
            "WHERE sr.created_by = :username", nativeQuery = true)
    Page<RecipeSummaryForCards> findSavedRecipeSummaryCardsByUser(@Param("username") String username, Pageable pageable);


    @Query("SELECT new org.group2.comp313.kitchen_companion.dto.recipe.RecipeSummaryForCardsWithScore(" +
            "r.id, r.title, r.thumbnailUrl, r.calories, " +
            "SUM(CASE WHEN cv.label = 'view' THEN 1 " +
            "WHEN cv.label = 'saved' THEN 10 " +
            "WHEN cv.label = 'rating' THEN 5 " +
            "ELSE 0 END) as interactionScore )" +
            "FROM Recipe r " +
            "LEFT JOIN UserInteraction ui ON r.id = ui.recipe " +
            "LEFT JOIN CodeValue cv ON cv.id = ui.userInteractionEventTypeCode " +
            "Left JOIN RatingCalculated rc on rc.recipe = r.id " +
            "GROUP BY r.id, rc.ratingValue " +
            "ORDER BY interactionScore DESC, rc.ratingValue, r.id DESC")
    List<RecipeSummaryForCardsWithScore> findTop10RecipesByInteractionScore(Pageable pageable);

}