package org.group2.comp313.kitchen_companion.service;

import org.group2.comp313.kitchen_companion.domain.Ingredient;
import org.group2.comp313.kitchen_companion.domain.Step;
import org.group2.comp313.kitchen_companion.dto.recipe.ComponentUpdateDto;
import org.group2.comp313.kitchen_companion.dto.recipe.IngredientDTO;
import org.group2.comp313.kitchen_companion.repository.IngredientRepository;
import org.group2.comp313.kitchen_companion.utility.EntityToBeUpdatedNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class IngredientService extends BaseService {

    private final IngredientRepository ingredientRepository;

    public IngredientService(IngredientRepository ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }

    public Ingredient createIngredient(IngredientDTO ingredientDTO, Integer ingredientGroupId, String createdBy) {

        Ingredient newIngredient = new Ingredient();

        newIngredient.setIngredientGroup(ingredientGroupId);
        newIngredient.setIngredientOrder(ingredientDTO.ingredientOrder());
        newIngredient.setLabel(ingredientDTO.label());
        newIngredient.setImageUrl(ingredientDTO.imageUrl());
        newIngredient.setCreatedBy(createdBy);
        newIngredient.setCreatedAt(Instant.now());
        newIngredient.setUpdatedAt(null);
        newIngredient.setUpdatedBy(null);

        return ingredientRepository.save(newIngredient);
    }

    public void updateIngredient(ComponentUpdateDto dto, String updatedBy) {

        Ingredient ingredient = ingredientRepository.findByIdAndCreatedBy(dto.id(), updatedBy).orElse(null);

        if (ingredient == null) {
            throw new EntityToBeUpdatedNotFoundException("Ingredient not found. Please check the id or if this belongs to user.");
        } else {
            ingredient.setUpdatedBy(updatedBy);
            ingredient.setUpdatedAt(Instant.now());
            if(dto.label() != null){
                ingredient.setLabel(dto.label());
            }

            if(dto.imageUrl() != null){
                ingredient.setImageUrl(dto.imageUrl());
            }

            ingredientRepository.save(ingredient);
        }
    }
}
