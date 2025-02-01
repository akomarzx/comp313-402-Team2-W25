package org.group2.comp313.kitchen_companion.mapper;

import org.group2.comp313.kitchen_companion.domain.Recipe;
import org.group2.comp313.kitchen_companion.dto.recipe.UpdateRecipeDTO;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface RecipeMapper {

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(ignore = true, target = "prepTimeUnitCd")
    @Mapping(ignore = true, target = "cookTimeUnitCd")
    Recipe partialUpdate(UpdateRecipeDTO recipeDTO, @MappingTarget Recipe recipe);
}