package org.group2.comp313.kitchen_companion.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "rating_calculated")
public class RatingCalculated {
    @Id
    @Column(name = "recipe_id", nullable = false)
    private Integer id;

    @NotNull
    @DecimalMin(value = "0.0")
    @DecimalMax(value = "5.0")
    @Column(name = "rating_value", nullable = false, precision = 4, scale = 2)
    private BigDecimal ratingValue;

    @NotNull
    @Column(name = "rating_count", nullable = false)
    private Integer ratingCount;

}