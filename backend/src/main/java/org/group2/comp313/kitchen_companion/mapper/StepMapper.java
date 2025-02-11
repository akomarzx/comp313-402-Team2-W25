package org.group2.comp313.kitchen_companion.mapper;

import org.group2.comp313.kitchen_companion.domain.Step;
import org.group2.comp313.kitchen_companion.dto.recipe.ComponentUpdateDto;
import org.group2.comp313.kitchen_companion.dto.recipe.StepDto;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface StepMapper {
    Step toEntity(StepDto stepDTO);

    StepDto toDto(Step step);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Step partialUpdate(StepDto stepDTO, @MappingTarget Step step);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Step partialUpdate(ComponentUpdateDto stepDTO, @MappingTarget Step step);
}