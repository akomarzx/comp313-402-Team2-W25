package org.group2.comp313.kitchen_companion.repository;

import org.group2.comp313.kitchen_companion.domain.static_code.CodeBook;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CodeBookRepository extends JpaRepository<CodeBook, Long> {
}