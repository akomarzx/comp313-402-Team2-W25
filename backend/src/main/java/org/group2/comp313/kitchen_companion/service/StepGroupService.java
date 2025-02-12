package org.group2.comp313.kitchen_companion.service;

import jakarta.transaction.Transactional;
import org.group2.comp313.kitchen_companion.domain.StepGroup;
import org.group2.comp313.kitchen_companion.dto.recipe.*;
import org.group2.comp313.kitchen_companion.mapper.StepGroupMapper;
import org.group2.comp313.kitchen_companion.repository.StepGroupRepository;
import org.group2.comp313.kitchen_companion.utility.EntityToBeUpdatedNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class StepGroupService extends BaseService {

    private final StepGroupRepository stepGroupRepository;
    private final StepService stepService;
    private final StepGroupMapper stepGroupMapper;

    public StepGroupService(StepGroupRepository stepGroupRepository, StepService stepService, StepGroupMapper stepGroupMapper) {
        this.stepGroupRepository = stepGroupRepository;
        this.stepService = stepService;
        this.stepGroupMapper = stepGroupMapper;
    }

    public Set<StepGroup> createStepGroup(List<StepGroupDto> newStepGroupList, Integer recipeId, String createdBy) {

        Set<StepGroup> stepGroups = new HashSet<>();

        for(StepGroupDto stepGroupDto: newStepGroupList){

            StepGroup newStepGroup = new StepGroup();
            newStepGroup.setLabel(stepGroupDto.label());
            newStepGroup.setStepGroupOrder(stepGroupDto.stepGroupOrder());
            newStepGroup.setSteps(new HashSet<>());
            newStepGroup.setRecipe(recipeId);
            newStepGroup.setCreatedBy(createdBy);
            newStepGroup.setCreatedAt(Instant.now());
            newStepGroup.setUpdatedAt(null);
            newStepGroup.setUpdatedBy(null);

            newStepGroup = this.stepGroupRepository.save(newStepGroup);

            Integer newStepGroupId = newStepGroup.getId();

            for(StepDto stepDto: stepGroupDto.steps()) {
                newStepGroup.getSteps().add(this.stepService.createStep(stepDto, newStepGroupId, createdBy));
            }

            stepGroups.add(newStepGroup);
        }

        return stepGroups;
    }

    @Transactional
    public void updateStepGroup(RecipeComponentUpdateDto dto, Integer recipeId, Integer stepGroupId, String updatedBy) {

        StepGroup stepGroup = this.stepGroupRepository.findByIdAndRecipeAndCreatedBy(stepGroupId, recipeId, updatedBy).orElse(null);

        if(stepGroup == null) {
            throw new EntityToBeUpdatedNotFoundException("Step group not found. Please check the recipe id, step group id, or this belongs to user.");
        } else {

            stepGroup.setUpdatedBy(updatedBy);
            stepGroup.setUpdatedAt(Instant.now());

            if(dto.label() != null) {
                stepGroup.setLabel(dto.label());
            }

            if(dto.componentUpdateDtoList() != null && !dto.componentUpdateDtoList().isEmpty()) {
                for(ComponentUpdateDto componentUpdateDto: dto.componentUpdateDtoList()) {
                    this.stepService.updateStep(componentUpdateDto, updatedBy);
                }
            }
        }
    }

    @Transactional
    public void updateStepGroup(StepGroupDto dto, Integer recipeId, Integer stepGroupId, String updatedBy) {

        StepGroup stepGroup = this.stepGroupRepository.findByIdAndRecipeAndCreatedBy(stepGroupId, recipeId, updatedBy).orElse(null);

        if(stepGroup == null) {
            throw new EntityToBeUpdatedNotFoundException("Step group not found. Please check the recipe id, step group id, or this belongs to user.");
        } else {

            this.stepGroupMapper.partialUpdate(dto, stepGroup);

            if(dto != null && !dto.steps().isEmpty()) {
                for(StepDto step: dto.steps()) {
                    this.stepService.updateStep(step, updatedBy);
                }
            }
        }
    }
}
