package org.group2.comp313.kitchen_companion.repository;

import org.group2.comp313.kitchen_companion.domain.CodeValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CodeValueRepository extends JpaRepository<CodeValue, Integer>, JpaSpecificationExecutor<CodeValue> {
}