package org.group2.comp313.kitchen_companion.service;

import org.group2.comp313.kitchen_companion.domain.Ingredient;
import org.group2.comp313.kitchen_companion.dto.recipe.IngredientDTO;
import org.group2.comp313.kitchen_companion.repository.IngredientRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class IngredientService extends BaseService {

    private final IngredientRepository ingredientRepository;

    public IngredientService(IngredientRepository ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }

    public void createIngredient(IngredientDTO ingredientDTO, Integer ingredientGroupId, String createdBy) {

        Ingredient newIngredient = new Ingredient();

        newIngredient.setIngredientGroup(ingredientGroupId);
        newIngredient.setIngredientOrder(ingredientDTO.ingredientOrder());
        newIngredient.setLabel(ingredientDTO.label());
        newIngredient.setImageUrl(ingredientDTO.imageUrl());
        newIngredient.setCreatedBy(createdBy);
        newIngredient.setCreatedAt(Instant.now());
        newIngredient.setUpdatedAt(null);
        newIngredient.setUpdatedBy(null);

        ingredientRepository.save(newIngredient);
    }
}
