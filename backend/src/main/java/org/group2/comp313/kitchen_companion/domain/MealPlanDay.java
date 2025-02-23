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
@Table(name = "meal_plan_days")
public class MealPlanDay {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "meal_plan_days_id", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "meal_plan_group_id", nullable = false)
    private Integer mealPlanGroup;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "breakfast_recipe_id")
    private Recipe breakfastRecipe;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "breakfast_recipe_substitute_cd")
    private CodeValue breakfastRecipeSubstituteCd;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lunch_recipe_id")
    private Recipe lunchRecipe;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lunch_recipe_substitute_cd")
    private CodeValue lunchRecipeSubstituteCd;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dinner_recipe_id")
    private Recipe dinnerRecipe;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dinner_recipe_substitute_cd")
    private CodeValue dinnerRecipeSubstituteCd;

    @NotNull
    @Column(name = "day_of_week_code", nullable = false)
    private Integer dayOfWeekCode;

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

}