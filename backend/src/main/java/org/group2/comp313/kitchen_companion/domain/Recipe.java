package org.group2.comp313.kitchen_companion.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "recipe")
public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recipe_id", nullable = false)
    private Integer id;

    @Size(max = 256)
    @NotNull
    @Column(name = "title", nullable = false, length = 256)
    private String title;

    @Size(max = 255)
    @Column(name = "summary")
    private String summary;

    @NotNull
    @Column(name = "prep_time", nullable = false)
    private Integer prepTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prep_time_unit_cd")
    private CodeValue prepTimeUnitCd;

    @NotNull
    @Column(name = "cook_time", nullable = false)
    private Integer cookTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cook_time_unit_cd")
    private CodeValue cookTimeUnitCd;

    @NotNull
    @Column(name = "servings", nullable = false)
    private Integer servings;

    @Size(max = 255)
    @Column(name = "yield")
    private String yield;

    @Size(max = 500)
    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @NotNull
    @Column(name = "calories", nullable = false, precision = 10, scale = 2)
    private BigDecimal calories;

    @NotNull
    @Column(name = "carbs_g", nullable = false, precision = 10, scale = 2)
    private BigDecimal carbsG;

    @NotNull
    @Column(name = "sugars_g", nullable = false, precision = 10, scale = 2)
    private BigDecimal sugarsG;

    @NotNull
    @Column(name = "fat_g", nullable = false, precision = 10, scale = 2)
    private BigDecimal fatG;

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