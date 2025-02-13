package org.group2.comp313.kitchen_companion.service;

import org.group2.comp313.kitchen_companion.domain.Step;
import org.group2.comp313.kitchen_companion.dto.recipe.ComponentUpdateDto;
import org.group2.comp313.kitchen_companion.dto.recipe.StepDto;
import org.group2.comp313.kitchen_companion.mapper.StepMapper;
import org.group2.comp313.kitchen_companion.repository.StepRepository;
import org.group2.comp313.kitchen_companion.utility.EntityToBeUpdatedNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class StepService extends BaseService {

    private final StepRepository stepRepository;
    private final StepMapper stepMapper;

    public StepService(StepRepository stepRepository, StepMapper stepMapper) {
        this.stepRepository = stepRepository;
        this.stepMapper = stepMapper;
    }

    /**
     * Creates a new Step entity based on the provided StepDto, step group ID, and creator information.
     *
     * @param newStepDto the data transfer object containing the details of the step to be created
     * @param stepGroupId the identifier of the step group to which the new step belongs
     * @param createdBy the username or identifier of the user creating the step
     * @return the created Step entity after saving it to the repository
     */
    public Step createStep(StepDto newStepDto, Integer stepGroupId, String createdBy) {

        Step newStep = new Step();

        newStep.setStepGroup(stepGroupId);
        newStep.setStepOrder(newStepDto.stepOrder());
        newStep.setImageUrl(newStepDto.imageUrl());
        newStep.setLabel(newStepDto.label());
        newStep.setCreatedBy(createdBy);
        newStep.setCreatedAt(Instant.now());
        newStep.setUpdatedAt(null);
        newStep.setUpdatedBy(null);

        return stepRepository.save(newStep);
    }

    /**
     * Updates an existing step with new data provided in the ComponentUpdateDto object.
     * The updates include modifying fields like label and image URL if they are not null.
     * The method also records the user who performed the update and the timestamp of the update.
     * If the step is not found or does not belong to the specified user, an exception is thrown.
     *
     * @param dto the data transfer object containing the details to update the step, such as id, label, and image URL
     * @param updatedBy the username or identifier of the user attempting to perform the update
     * @throws EntityToBeUpdatedNotFoundException if the step with the given id does not exist or does not belong to the user
     */
    public void updateStep(ComponentUpdateDto dto, String updatedBy) {

        Step step = stepRepository.findByIdAndCreatedBy(dto.id(), updatedBy).orElse(null);

        if (step == null) {
            throw new EntityToBeUpdatedNotFoundException("Step not found. Please check the id or if this belongs to user.");
        } else {

            step.setUpdatedBy(updatedBy);
            step.setUpdatedAt(Instant.now());

            if(dto.label() != null){
                step.setLabel(dto.label());
            }

            if(dto.imageUrl() != null){
                step.setImageUrl(dto.imageUrl());
            }

            stepRepository.save(step);

        }
    }

    /**
     * Updates an existing step with new data provided in the StepDto object.
     * The method applies partial updates using the provided data transfer object and
     * records the user who performed the update and the timestamp of the update.
     * If the step is not found or does not belong to the specified user, an exception is thrown.
     *
     * @param dto the data transfer object containing the details to update the step, such as id, label, and image URL
     * @param updatedBy the username or identifier of the user attempting to perform the update
     * @throws EntityToBeUpdatedNotFoundException if the step with the given id does not exist or does not belong to the user
     */
    public void updateStep(StepDto dto, String updatedBy) {

        Step step = stepRepository.findByIdAndCreatedBy(dto.id(), updatedBy).orElse(null);

        if (step == null) {
            throw new EntityToBeUpdatedNotFoundException("Step not found. Please check the id or if this belongs to user.");
        } else {

            step.setUpdatedBy(updatedBy);
            step.setUpdatedAt(Instant.now());

            this.stepMapper.partialUpdate(dto, step);

            stepRepository.save(step);

        }
    }
}
