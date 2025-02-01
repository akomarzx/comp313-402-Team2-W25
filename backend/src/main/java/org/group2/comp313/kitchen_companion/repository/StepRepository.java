package org.group2.comp313.kitchen_companion.repository;

import org.group2.comp313.kitchen_companion.domain.Step;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface StepRepository extends JpaRepository<Step, Integer>, JpaSpecificationExecutor<Step> {
    Optional<Step> findByIdAndCreatedBy(Integer id, String createdBy);
}