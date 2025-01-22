package org.group2.comp313.kitchen_companion.service;

import org.group2.comp313.kitchen_companion.domain.Ingredient;
import org.group2.comp313.kitchen_companion.dto.recipe.IngredientDTO;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class IngredientService extends BaseService {

    public Ingredient createIngredient(IngredientDTO ingredientDTO, String createdBy) {
        Ingredient newIngredient = new Ingredient();
        newIngredient.setIngredientOrder(ingredientDTO.ingredientOrder());
        newIngredient.setImageUrl(ingredientDTO.imageUrl());
        newIngredient.setCreatedBy(createdBy);
        newIngredient.setCreatedAt(Instant.now());
        newIngredient.setUpdatedAt(null);
        newIngredient.setUpdatedBy(null);
        return newIngredient;
    }
}
