package org.group2.comp313.kitchen_companion.service;

import org.group2.comp313.kitchen_companion.domain.StepGroup;
import org.group2.comp313.kitchen_companion.dto.recipe.IngredientDTO;
import org.group2.comp313.kitchen_companion.dto.recipe.StepDTO;
import org.group2.comp313.kitchen_companion.dto.recipe.StepGroupDTO;
import org.group2.comp313.kitchen_companion.repository.StepGroupRepository;
import org.group2.comp313.kitchen_companion.repository.StepRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class StepGroupService extends BaseService {

    private final StepGroupRepository stepGroupRepository;
    private final StepService stepService;

    public StepGroupService(StepGroupRepository stepGroupRepository, StepService stepService) {
        this.stepGroupRepository = stepGroupRepository;
        this.stepService = stepService;
    }

    public Set<StepGroup> createStepGroup(List<StepGroupDTO> newStepGroupList, Integer recipeId, String createdBy) {

        Set<StepGroup> stepGroups = new HashSet<>();

        for(StepGroupDTO stepGroupDto: newStepGroupList){

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

            for(StepDTO stepDto: stepGroupDto.steps()) {
                this.stepService.createStep(stepDto, newStepGroupId, createdBy);
            }

            stepGroups.add(newStepGroup);
        }

        return stepGroups;
    }
}
