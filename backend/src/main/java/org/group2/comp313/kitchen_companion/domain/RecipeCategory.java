package org.group2.comp313.kitchen_companion.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "recipe_category")
public class RecipeCategory {

    @EmbeddedId
    private RecipeCategoryId id;

    @NotNull
    @Column(name = "created_at", nullable = false)
    @JsonIgnore
    private Instant createdAt;

    @Size(max = 256)
    @NotNull
    @Column(name = "created_by", nullable = false, length = 256)
    @JsonIgnore
    private String createdBy;

    @Column(name = "updated_at")
    @JsonIgnore
    private Instant updatedAt;

    @Size(max = 256)
    @Column(name = "updated_by", length = 256)
    @JsonIgnore
    private String updatedBy;

    @MapsId("recipeId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id")
    @JsonIgnore
    private Recipe recipe;

}