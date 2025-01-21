package org.group2.comp313.kitchen_companion.repository;

import org.group2.comp313.kitchen_companion.domain.StepGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface StepGroupRepository extends JpaRepository<StepGroup, Integer>, JpaSpecificationExecutor<StepGroup> {
}