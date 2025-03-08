package org.group2.comp313.kitchen_companion.repository;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.group2.comp313.kitchen_companion.domain.UserInteraction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserInteractionRepository extends JpaRepository<UserInteraction, Integer> {
    Optional<UserInteraction> findUserInteractionBySessionIdAndUserInteractionEventTypeCode(@Size(max = 255) String sessionId, @NotNull Integer userInteractionEventTypeCode);

    Optional<UserInteraction> findUserInteractionBySessionIdAndUserInteractionEventTypeCodeAndRecipe(@Size(max = 255) String sessionId, @NotNull Integer userInteractionEventTypeCode, @NotNull Integer recipe);
}