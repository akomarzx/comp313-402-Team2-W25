package org.group2.comp313.kitchen_companion.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "category")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id", nullable = false)
    private Integer id;

    @Size(max = 255)
    @NotNull
    @Column(name = "label", nullable = false)
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
        return String.format("category_id: %s, category_label: %s", id, label);
    }
}