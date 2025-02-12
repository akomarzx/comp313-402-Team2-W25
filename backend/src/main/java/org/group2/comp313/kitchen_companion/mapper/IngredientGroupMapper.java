package org.group2.comp313.kitchen_companion.mapper;

import org.group2.comp313.kitchen_companion.domain.IngredientGroup;
import org.group2.comp313.kitchen_companion.dto.recipe.IngredientGroupDto;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeComponentUpdateDto;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface IngredientGroupMapper {
    IngredientGroup toEntity(IngredientGroupDto ingredientGroupDTO);

    @AfterMapping
    default void linkIngredients(@MappingTarget IngredientGroup ingredientGroup) {
        ingredientGroup.getIngredients().forEach(ingredient -> ingredient.setIngredientGroup(ingredientGroup.getId()));
    }

    IngredientGroupDto toDto(IngredientGroup ingredientGroup);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    IngredientGroup partialUpdate(RecipeComponentUpdateDto ingredientGroupDTO, @MappingTarget IngredientGroup ingredientGroup);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    IngredientGroup partialUpdate(IngredientGroupDto ingredientGroupDTO, @MappingTarget IngredientGroup ingredientGroup);
}