package org.group2.comp313.kitchen_companion.mapper;

import org.group2.comp313.kitchen_companion.domain.Ingredient;
import org.group2.comp313.kitchen_companion.dto.recipe.ComponentUpdateDto;
import org.group2.comp313.kitchen_companion.dto.recipe.IngredientDTO;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface IngredientMapper {
    Ingredient toEntity(IngredientDTO ingredientDTO);

    IngredientDTO toDto(Ingredient ingredient);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Ingredient partialUpdate(IngredientDTO ingredientDTO, @MappingTarget Ingredient ingredient);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Ingredient partialUpdate(ComponentUpdateDto ingredientDTO, @MappingTarget Ingredient ingredient);
}