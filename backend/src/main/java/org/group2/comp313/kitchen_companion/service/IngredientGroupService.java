package org.group2.comp313.kitchen_companion.service;

import org.group2.comp313.kitchen_companion.domain.Ingredient;
import org.group2.comp313.kitchen_companion.domain.IngredientGroup;
import org.group2.comp313.kitchen_companion.dto.recipe.IngredientDTO;
import org.group2.comp313.kitchen_companion.dto.recipe.IngredientGroupDTO;
import org.group2.comp313.kitchen_companion.repository.IngredientGroupRepository;
import org.group2.comp313.kitchen_companion.repository.IngredientRepository;
import org.springframework.stereotype.Service;

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

    public IngredientGroup createIngredientGroup(IngredientGroupDTO newIngredientGroupDto, String createdBy) {
        IngredientGroup ingredientGroup = new IngredientGroup();
        ingredientGroup.setLabel(newIngredientGroupDto.label());
        ingredientGroup.setIngredientGroupOrder(newIngredientGroupDto.ingredientGroupOrder());

        Set<Ingredient> ingredientList = new HashSet<>();

        for(IngredientDTO ingredientDto : newIngredientGroupDto.ingredients()) {
            ingredientList.add(this.ingredientService.createIngredient(ingredientDto, createdBy));
        }
        ingredientGroup.setIngredients(ingredientList);

        return ingredientGroup;
    }
}
