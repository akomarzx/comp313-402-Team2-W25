package org.group2.comp313.kitchen_companion.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serial;
import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class RecipeCategoryId implements Serializable {

    @Serial
    private static final long serialVersionUID = -3811494142772614207L;


    @NotNull
    @Column(name = "category_id", nullable = false)
    private Integer categoryId;

    @NotNull
    @Column(name = "recipe_id", nullable = false)
    private Integer recipeId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        RecipeCategoryId entity = (RecipeCategoryId) o;
        return Objects.equals(this.categoryId, entity.categoryId) &&
                Objects.equals(this.recipeId, entity.recipeId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(categoryId, recipeId);
    }

}