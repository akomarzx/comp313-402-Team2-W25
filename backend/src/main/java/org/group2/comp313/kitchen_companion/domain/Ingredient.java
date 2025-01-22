package org.group2.comp313.kitchen_companion.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "ingredient")
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ingredient_id", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "ingredient_group_id", nullable = false)
    private Integer ingredientGroup;

    @NotNull
    @Column(name = "ingredient_order", nullable = false)
    private Integer ingredientOrder;

    @Size(max = 500)
    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Size(max = 255)
    @NotNull
    @Column(name = "label", nullable = false)
    private String label;

    @Size(max = 256)
    @NotNull
    @Column(name = "created_by", nullable = false, length = 256)
    private String createdBy;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Size(max = 256)
    @Column(name = "updated_by", length = 256)
    private String updatedBy;

}