package org.group2.comp313.kitchen_companion.mapper;

import org.group2.comp313.kitchen_companion.domain.StepGroup;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeComponentUpdateDto;
import org.group2.comp313.kitchen_companion.dto.recipe.StepGroupDto;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface StepGroupMapper {
    StepGroup toEntity(StepGroupDto stepGroupDTO);

    @AfterMapping
    default void linkSteps(@MappingTarget StepGroup stepGroup) {
        stepGroup.getSteps().forEach(step -> step.setStepGroup(stepGroup.getId()));
    }

    StepGroupDto toDto(StepGroup stepGroup);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    StepGroup partialUpdate(StepGroupDto stepGroupDTO, @MappingTarget StepGroup stepGroup);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    StepGroup partialUpdate(RecipeComponentUpdateDto stepGroupDTO, @MappingTarget StepGroup stepGroup);
}