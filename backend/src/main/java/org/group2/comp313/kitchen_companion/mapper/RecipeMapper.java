package org.group2.comp313.kitchen_companion.mapper;

import org.group2.comp313.kitchen_companion.domain.Recipe;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeDTO;
import org.group2.comp313.kitchen_companion.dto.recipe.UpdateRecipeDTO;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        uses = {CodeValueMapper.class} )
public interface RecipeMapper {

    @Mapping(target = "prepTimeUnitCd", source = "prepTimeUnitCd", qualifiedByName = "toEntity")
    @Mapping(target = "cookTimeUnitCd", source = "cookTimeUnitCd", qualifiedByName = "toEntity")
    Recipe toEntity(RecipeDTO recipeDTO);

    @AfterMapping
    default void linkIngredientGroups(@MappingTarget Recipe recipe) {
        recipe.getIngredientGroups().forEach(ingredientGroup -> ingredientGroup.setRecipe(recipe.getId()));
    }

    @AfterMapping
    default void linkStepGroups(@MappingTarget Recipe recipe) {
        recipe.getStepGroups().forEach(stepGroup -> stepGroup.setRecipe(recipe.getId()));
    }

    @Mapping(target = "prepTimeUnitCd", source = "prepTimeUnitCd", qualifiedByName = "toDto")
    @Mapping(target = "cookTimeUnitCd", source = "cookTimeUnitCd", qualifiedByName = "toDto")
    RecipeDTO toDto(Recipe recipe);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(ignore = true, target = "prepTimeUnitCd")
    @Mapping(ignore = true, target = "cookTimeUnitCd")
    Recipe partialUpdate(UpdateRecipeDTO recipeDTO, @MappingTarget Recipe recipe);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "prepTimeUnitCd", source = "prepTimeUnitCd", qualifiedByName = "toEntity")
    @Mapping(target = "cookTimeUnitCd", source = "cookTimeUnitCd", qualifiedByName = "toEntity")
    Recipe partialUpdate(RecipeDTO recipeDTO, @MappingTarget Recipe recipe);

}