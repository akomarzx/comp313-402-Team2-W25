package org.group2.comp313.kitchen_companion.service;

import org.group2.comp313.kitchen_companion.domain.Ingredient;
import org.group2.comp313.kitchen_companion.domain.IngredientGroup;
import org.group2.comp313.kitchen_companion.domain.Recipe;
import org.group2.comp313.kitchen_companion.dto.recipe.IngredientDTO;
import org.group2.comp313.kitchen_companion.dto.recipe.IngredientGroupDTO;
import org.group2.comp313.kitchen_companion.repository.IngredientGroupRepository;
import org.group2.comp313.kitchen_companion.repository.IngredientRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
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

    public void createIngredientGroups(List<IngredientGroupDTO> newIngredientGroupDtoList, Integer recipeId, String createdBy) {

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
                this.ingredientService.createIngredient(ingredientDto, ingredientGroupId, createdBy);
            }
        }
    }
}
