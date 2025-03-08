package org.group2.comp313.kitchen_companion.repository;

import org.group2.comp313.kitchen_companion.domain.UserInteraction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserInteractionRepository extends JpaRepository<UserInteraction, Integer> {
}