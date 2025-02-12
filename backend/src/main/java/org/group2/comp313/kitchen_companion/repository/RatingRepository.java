package org.group2.comp313.kitchen_companion.repository;

import org.group2.comp313.kitchen_companion.domain.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Integer> {

    Optional<Rating> findOneByRecipeAndCreatedBy(Integer recipe, String createdBy);

    @Query("SELECT AVG(r.ratingValue) FROM Rating r WHERE r.recipe = ?1")
    BigDecimal getAverageRatingByRecipe(Integer recipe);

    long countByRecipe(Integer recipe);

    Optional<Rating> findByRecipeAndCreatedBy(Integer recipe, String createdBy);
    Optional<Rating> findByIdAndCreatedBy(Integer id, String createdBy);
}