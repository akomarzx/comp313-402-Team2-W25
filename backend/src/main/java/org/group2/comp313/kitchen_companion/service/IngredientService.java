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

    /**
     * Creates a new ingredient based on the provided parameters and persists it in the repository.
     *
     * @param ingredientDTO the data transfer object containing information about the ingredient to be created
     * @param ingredientGroupId the identifier of the ingredient group to which the new ingredient belongs
     * @param createdBy the username or identifier of the user creating the ingredient
     * @return the newly created and persisted Ingredient object
     */
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

    /**
     * Updates an existing ingredient using the details provided in the ComponentUpdateDto object.
     *
     * @param dto the data transfer object containing the updated details for the ingredient
     * @param updatedBy the username or identifier of the user performing the update
     * @throws EntityToBeUpdatedNotFoundException if the ingredient to be updated cannot be found
     *         or does not belong to the user identified by updatedBy
     */
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

    /**
     * Updates an existing ingredient using the details provided in the IngredientDto object.
     *
     * @param dto the data transfer object containing the updated details for the ingredient
     * @param updatedBy the username or identifier of the user performing the update
     * @throws EntityToBeUpdatedNotFoundException if the ingredient to be updated cannot be found
     *         or does not belong to the user identified by updatedBy
     */
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
