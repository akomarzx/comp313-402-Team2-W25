package org.group2.comp313.kitchen_companion.repository;

import org.group2.comp313.kitchen_companion.domain.RatingCalculated;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RatingCalculatedRepository extends JpaRepository<RatingCalculated, Integer> {
}