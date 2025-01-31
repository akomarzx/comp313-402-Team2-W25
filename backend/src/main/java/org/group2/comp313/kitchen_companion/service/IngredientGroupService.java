package org.group2.comp313.kitchen_companion.service;

import jakarta.transaction.Transactional;
import org.group2.comp313.kitchen_companion.domain.IngredientGroup;
import org.group2.comp313.kitchen_companion.dto.recipe.ComponentUpdateDto;
import org.group2.comp313.kitchen_companion.dto.recipe.IngredientDTO;
import org.group2.comp313.kitchen_companion.dto.recipe.IngredientGroupDTO;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeComponentUpdateDto;
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

    public IngredientGroupService(IngredientGroupRepository ingredientGroupRepository, IngredientService ingredientService) {
        this.ingredientGroupRepository = ingredientGroupRepository;
        this.ingredientService = ingredientService;
    }

    public Set<IngredientGroup> createIngredientGroups(List<IngredientGroupDTO> newIngredientGroupDtoList, Integer recipeId, String createdBy) {

        Set<IngredientGroup> ingredientGroups = new HashSet<>();

        for(IngredientGroupDTO ingredientGroupDto: newIngredientGroupDtoList){

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

            for(IngredientDTO ingredientDto : ingredientGroupDto.ingredients()) {
                ingredientGroup.getIngredients().add(this.ingredientService.createIngredient(ingredientDto, ingredientGroupId, createdBy));
            }

            ingredientGroups.add(ingredientGroup);
        }

        return ingredientGroups;
    }

    @Transactional
    public void updateIngredientGroup(RecipeComponentUpdateDto dto, Integer recipeId, Integer ingredientGroupId, String updatedBy) {

        IngredientGroup ingredientGroup = this.ingredientGroupRepository.findByIdAndRecipeAndCreatedBy(ingredientGroupId, recipeId, updatedBy).orElse(null);

        if(ingredientGroup == null) {
            throw new EntityToBeUpdatedNotFoundException("Step group not found. Please check the recipe id, step group id, or this belongs to user.");
        } else {

            ingredientGroup.setUpdatedBy(updatedBy);
            ingredientGroup.setUpdatedAt(Instant.now());

            if(dto.label() != null) {
                ingredientGroup.setLabel(dto.label());
            }

            if(dto.componentUpdateDtoList() != null && !dto.componentUpdateDtoList().isEmpty()) {
                for(ComponentUpdateDto componentUpdateDto: dto.componentUpdateDtoList()) {
                    this.ingredientService.updateIngredient(componentUpdateDto, updatedBy);
                }
            }
        }
    }
}
