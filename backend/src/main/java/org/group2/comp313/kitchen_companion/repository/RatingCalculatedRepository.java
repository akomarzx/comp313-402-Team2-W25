package org.group2.comp313.kitchen_companion.repository;

import jakarta.validation.constraints.NotNull;
import org.group2.comp313.kitchen_companion.domain.RatingCalculated;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RatingCalculatedRepository extends JpaRepository<RatingCalculated, Integer> {
    Optional<RatingCalculated> findByRecipe(@NotNull Integer recipe);
}