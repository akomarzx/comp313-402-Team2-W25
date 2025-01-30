package org.group2.comp313.kitchen_companion.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "code_value")
public class CodeValue {
    @Id
    @Column(name = "code_value_id", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "code_book_id", nullable = false)
    private Integer codeBook;

    @Size(max = 256)
    @NotNull
    @Column(name = "label", nullable = false, length = 256)
    private String label;

    @NotNull
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Size(max = 256)
    @NotNull
    @Column(name = "created_by", nullable = false, length = 256)
    private String createdBy;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Size(max = 256)
    @Column(name = "updated_by", length = 256)
    private String updatedBy;

    @Override
    public String toString() {
        return String.format("code_value_id: %s, label: %s", id, label);
    }
}