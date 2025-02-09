package org.group2.comp313.kitchen_companion.mapper;

import org.group2.comp313.kitchen_companion.domain.*;
import org.group2.comp313.kitchen_companion.dto.recipe.IngredientGroupDTO;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeDTO;
import org.group2.comp313.kitchen_companion.dto.recipe.StepGroupDTO;
import org.mapstruct.*;

import java.time.Instant;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        uses = {CodeValueMapper.class},
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface RecipeMapper {

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "prepTimeUnitCd", source = "prepTimeUnitCd", qualifiedByName = "toEntity")
    @Mapping(target = "cookTimeUnitCd", source = "cookTimeUnitCd", qualifiedByName = "toEntity")
    @Mapping(target = "ingredientGroups", source = "categoryIds", ignore = true)
    @Mapping(target = "stepGroups", ignore = true)
    Recipe toRecipe(RecipeDTO recipeDTO);

    @Mapping(target = "prepTimeUnitCd", source = "prepTimeUnitCd", qualifiedByName = "toEntity")
    @Mapping(target = "cookTimeUnitCd", source = "cookTimeUnitCd", qualifiedByName = "toEntity")
    Recipe partialUpdate(RecipeDTO recipeDTO, @MappingTarget Recipe recipe);

    @AfterMapping
    default void mergeIngredientGroups(@MappingTarget Recipe recipe, RecipeDTO recipeDTO) {

        if (recipeDTO.ingredientGroups() != null) {

            Map<Integer, IngredientGroup> existingGroups = recipe.getIngredientGroups().stream()
                    .collect(Collectors.toMap(IngredientGroup::getId, ig -> ig));

            Set<IngredientGroup> updatedGroups = recipeDTO.ingredientGroups().stream()
                    .map(dto -> {

                        IngredientGroup group = existingGroups.getOrDefault(dto.id(), new IngredientGroup());

                        group.setIngredientGroupOrder(dto.ingredientGroupOrder());
                        group.setRecipe(recipe.getId());
                        group.setLabel(dto.label());

                        if (group.getCreatedBy() == null) {
                            group.setCreatedBy(recipe.getCreatedBy());
                        }

                        if (group.getCreatedAt() == null) {
                            group.setCreatedAt(recipe.getCreatedAt());
                        }

                        mergeIngredients(group, dto);

                        return group;
                    })
                    .collect(Collectors.toSet());

            recipe.setIngredientGroups(updatedGroups);
        }
    }

    @AfterMapping
    default void mergeStepGroups(@MappingTarget Recipe recipe, RecipeDTO recipeDTO) {
        if (recipeDTO.stepGroups() != null) {

            Map<Integer, StepGroup> existingGroups = recipe.getStepGroups().stream()
                    .collect(Collectors.toMap(StepGroup::getId, sg -> sg));

            Set<StepGroup> updatedGroups = recipeDTO.stepGroups().stream()
                    .map(dto -> {
                        StepGroup group = existingGroups.getOrDefault(dto.id(), new StepGroup());

                        group.setStepGroupOrder(dto.stepGroupOrder());
                        group.setLabel(dto.label());
                        group.setRecipe(recipe.getId());

                        if (group.getCreatedBy() == null) {
                            group.setCreatedBy(recipe.getCreatedBy());
                        }

                        if (group.getCreatedAt() == null) {
                            group.setCreatedAt(recipe.getCreatedAt());
                        }
                        mergeSteps(group, dto);

                        return group;
                    })
                    .collect(Collectors.toSet());

            recipe.setStepGroups(updatedGroups);
        }
    }

    private void mergeIngredients(IngredientGroup group, IngredientGroupDTO dto) {

        if (dto.ingredients() != null) {

            Map<Integer, Ingredient> existingIngredients = group.getIngredients().stream()
                    .collect(Collectors.toMap(Ingredient::getId, i -> i));

            Set<Ingredient> updatedIngredients = dto.ingredients().stream()
                    .map(ingredientDTO -> {

                        Ingredient ingredient = existingIngredients.getOrDefault(ingredientDTO.id(), new Ingredient());

                        ingredient.setIngredientOrder(ingredientDTO.ingredientOrder());

                        ingredient.setImageUrl(ingredientDTO.imageUrl());
                        ingredient.setLabel(ingredientDTO.label());
                        ingredient.setIngredientGroup(group.getId());

                        if (ingredient.getCreatedBy() == null) {
                            ingredient.setCreatedBy(group.getCreatedBy());
                        }

                        if (ingredient.getCreatedAt() == null) {
                            ingredient.setCreatedAt(group.getCreatedAt());
                        }

                        return ingredient;
                    })
                    .collect(Collectors.toSet());

            group.setIngredients(updatedIngredients);
        }
    }

    private void mergeSteps(StepGroup group, StepGroupDTO dto) {

        if (dto.steps() != null) {
            Map<Integer, Step> existingSteps = group.getSteps().stream()
                    .collect(Collectors.toMap(Step::getId, s -> s));

            Set<Step> updatedSteps = dto.steps().stream()
                    .map(stepDTO -> {

                        Step step = existingSteps.getOrDefault(stepDTO.id(), new Step());

                        step.setStepOrder(stepDTO.stepOrder());
                        step.setLabel(stepDTO.label());
                        step.setImageUrl(stepDTO.imageUrl());
                        step.setStepGroup(group.getId());

                        if (step.getCreatedBy() == null) {
                            step.setCreatedBy(group.getCreatedBy());
                        }
                        if (step.getCreatedAt() == null) {
                            step.setCreatedAt(group.getCreatedAt());
                        }

                        return step;
                    })
                    .collect(Collectors.toSet());

            group.setSteps(updatedSteps);
        }
    }
}
