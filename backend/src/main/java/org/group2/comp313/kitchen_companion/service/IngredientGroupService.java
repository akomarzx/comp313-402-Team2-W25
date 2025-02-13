package org.group2.comp313.kitchen_companion.service;

import jakarta.transaction.Transactional;
import org.group2.comp313.kitchen_companion.domain.IngredientGroup;
import org.group2.comp313.kitchen_companion.dto.recipe.ComponentUpdateDto;
import org.group2.comp313.kitchen_companion.dto.recipe.IngredientDto;
import org.group2.comp313.kitchen_companion.dto.recipe.IngredientGroupDto;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeComponentUpdateDto;
import org.group2.comp313.kitchen_companion.mapper.IngredientGroupMapper;
import org.group2.comp313.kitchen_companion.repository.IngredientGroupRepository;
import org.group2.comp313.kitchen_companion.utility.EntityToBeUpdatedNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class IngredientGroupService extends BaseService {

    private final IngredientGroupRepository ingredientGroupRepository;
    private final IngredientService ingredientService;
    private final IngredientGroupMapper ingredientGroupMapper;

    public IngredientGroupService(IngredientGroupRepository ingredientGroupRepository,
                                  IngredientService ingredientService,
                                  IngredientGroupMapper ingredientGroupMapper) {
        this.ingredientGroupRepository = ingredientGroupRepository;
        this.ingredientService = ingredientService;
        this.ingredientGroupMapper = ingredientGroupMapper;
    }

    /**
     * Creates a set of IngredientGroup entities based on the provided list of IngredientGroupDto objects.
     * Saves the newly created IngredientGroup entities into the repository and associates them
     * with the given recipeId.
     *
     * @param newIngredientGroupDtoList the list of IngredientGroupDto objects to be converted into IngredientGroup entities
     * @param recipeId the ID of the recipe to which the IngredientGroups will be associated
     * @param createdBy the username or identifier of the creator of these ingredient groups
     * @return a set of IngredientGroup entities that were created and saved
     */
    public Set<IngredientGroup> createIngredientGroups(List<IngredientGroupDto> newIngredientGroupDtoList, Integer recipeId, String createdBy) {

        Set<IngredientGroup> ingredientGroups = new HashSet<>();

        for(IngredientGroupDto ingredientGroupDto: newIngredientGroupDtoList){

            IngredientGroup ingredientGroup = new IngredientGroup();
            ingredientGroup.setLabel(ingredientGroupDto.label());
            ingredientGroup.setIngredientGroupOrder(ingredientGroupDto.ingredientGroupOrder());
            ingredientGroup.setIngredients(new HashSet<>());
            ingredientGroup.setRecipe(recipeId);
            ingredientGroup.setCreatedBy(createdBy);
            ingredientGroup.setCreatedAt(Instant.now());
            ingredientGroup.setUpdatedAt(null);
            ingredientGroup.setUpdatedBy(null);

            ingredientGroup = this.ingredientGroupRepository.save(ingredientGroup);
            Integer ingredientGroupId = ingredientGroup.getId();

            for(IngredientDto ingredientDto : ingredientGroupDto.ingredients()) {
                ingredientGroup.getIngredients().add(this.ingredientService.createIngredient(ingredientDto, ingredientGroupId, createdBy));
            }

            ingredientGroups.add(ingredientGroup);
        }

        return ingredientGroups;
    }

    /**
     * Updates an ingredient group associated with a specified recipe and updates its related components.
     *
     * @param dto the data transfer object containing updated details for the ingredient group and its components
     * @param recipeId the ID of the recipe the ingredient group belongs to
     * @param ingredientGroupId the ID of the ingredient group to be updated
     * @param updatedBy the username or identifier of the user performing the update
     * @throws EntityToBeUpdatedNotFoundException if the specified ingredient group cannot be found or does not belong to the user
     */
    @Transactional
    public void updateIngredientGroup(RecipeComponentUpdateDto dto, Integer recipeId, Integer ingredientGroupId, String updatedBy) {

        IngredientGroup ingredientGroup = this.ingredientGroupRepository.findByIdAndRecipeAndCreatedBy(ingredientGroupId, recipeId, updatedBy).orElse(null);

        if(ingredientGroup == null) {
            throw new EntityToBeUpdatedNotFoundException("Step group not found. Please check the recipe id, step group id, or this belongs to user.");
        } else {

            ingredientGroup.setUpdatedBy(updatedBy);
            ingredientGroup.setUpdatedAt(Instant.now());

            this.ingredientGroupMapper.partialUpdate(dto, ingredientGroup);

            if(dto.componentUpdateDtoList() != null && !dto.componentUpdateDtoList().isEmpty()) {
                for(ComponentUpdateDto componentUpdateDto: dto.componentUpdateDtoList()) {
                    this.ingredientService.updateIngredient(componentUpdateDto, updatedBy);
                }
            }
        }
    }

    /**
     * Updates an existing ingredient group associated with a recipe and a specific user.
     * The method fetches the ingredient group by its ID, recipe ID, and user who created it,
     * then applies updates based on the provided data transfer object (DTO).
     * It also updates all the ingredients under the group if provided with a list of ingredients in the DTO.
     *
     * @param dto           The data transfer object containing updates for the ingredient group.
     * @param recipeId      The ID of the recipe the ingredient group belongs to.
     * @param ingredientGroupId The ID of the ingredient group to be updated.
     * @param updatedBy     The username of the user performing the update.
     * @return The updated ingredient group.
     * @throws EntityToBeUpdatedNotFoundException If the ingredient group is not found based on the provided criteria.
     */
    @Transactional
    public IngredientGroup updateIngredientGroup(IngredientGroupDto dto, Integer recipeId, Integer ingredientGroupId, String updatedBy) {

        IngredientGroup ingredientGroup = this.ingredientGroupRepository.findByIdAndRecipeAndCreatedBy(ingredientGroupId, recipeId, updatedBy).orElse(null);

        if(ingredientGroup == null) {
            throw new EntityToBeUpdatedNotFoundException("Step group not found. Please check the recipe id, step group id, or this belongs to user.");
        } else {

            ingredientGroup.setUpdatedBy(updatedBy);
            ingredientGroup.setUpdatedAt(Instant.now());

            this.ingredientGroupMapper.partialUpdate(dto, ingredientGroup);

            if(dto.ingredients() != null && !dto.ingredients().isEmpty()) {
                for(IngredientDto ingredient : dto.ingredients()) {
                    this.ingredientService.updateIngredient(ingredient, updatedBy);
                }
            }

            return ingredientGroup;
        }
    }
}
