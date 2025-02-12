package org.group2.comp313.kitchen_companion.service;

import org.group2.comp313.kitchen_companion.domain.Ingredient;
import org.group2.comp313.kitchen_companion.dto.recipe.ComponentUpdateDto;
import org.group2.comp313.kitchen_companion.dto.recipe.IngredientDto;
import org.group2.comp313.kitchen_companion.mapper.IngredientMapper;
import org.group2.comp313.kitchen_companion.repository.IngredientRepository;
import org.group2.comp313.kitchen_companion.utility.EntityToBeUpdatedNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class IngredientService extends BaseService {

    private final IngredientRepository ingredientRepository;
    private final IngredientMapper ingredientMapper;

    public IngredientService(IngredientRepository ingredientRepository, IngredientMapper ingredientMapper) {
        this.ingredientRepository = ingredientRepository;
        this.ingredientMapper = ingredientMapper;
    }

    public Ingredient createIngredient(IngredientDto ingredientDTO, Integer ingredientGroupId, String createdBy) {

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

    public void updateIngredient(IngredientDto dto, String updatedBy) {

        Ingredient ingredient = ingredientRepository.findByIdAndCreatedBy(dto.id(), updatedBy).orElse(null);

        if (ingredient == null) {
            throw new EntityToBeUpdatedNotFoundException("Ingredient not found. Please check the id or if this belongs to user.");
        } else {

            ingredient.setUpdatedBy(updatedBy);
            ingredient.setUpdatedAt(Instant.now());

            this.ingredientMapper.partialUpdate(dto, ingredient);

            ingredientRepository.save(ingredient);
        }
    }

}
