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

    /**
     * Creates a set of StepGroup entities from a list of StepGroupDto objects, associates
     * them with a specific recipe, and sets the createdBy field. Each StepGroup is persisted
     * in the repository and populated with associated steps.
     *
     * @param newStepGroupList the list of StepGroupDto objects representing the step groups to be created
     * @param recipeId the unique identifier of the recipe to associate with the step groups
     * @param createdBy the identifier of the user creating the step groups
     * @return a set of newly created and persisted StepGroup entities
     */
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

    /**
     * Updates an existing StepGroup entity associated with a specific recipe and user.
     * The method updates the StepGroup's label and its associated components based on
     * the provided data transfer object (DTO).
     *
     * @param dto the data transfer object containing updated StepGroup and component information
     * @param recipeId the unique identifier of the recipe to which the StepGroup belongs
     * @param stepGroupId the unique identifier of the StepGroup to be updated
     * @param updatedBy the identifier of the user performing the update operation
     * @throws EntityToBeUpdatedNotFoundException if the StepGroup to be updated is not found
     */
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

    /**
     * Updates an existing step group entity associated with a given recipe.
     * The method retrieves the step group using the provided recipe ID, step group ID,
     * and the identifier of the user who is updating it. If the step group is found,
     * it applies updates from the provided {@code StepGroupDto}. Additionally, it processes
     * any associated steps within the step group for updates.
     *
     * @param dto the data transfer object containing the updated data for the step group
     * @param recipeId the ID of the recipe the step group belongs to
     * @param stepGroupId the ID of the step group to be updated
     * @param updatedBy the identifier of the user performing the update
     * @throws EntityToBeUpdatedNotFoundException if the step group is not found based on the
     *         recipe ID, step group ID, and the user identifier
     */
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
