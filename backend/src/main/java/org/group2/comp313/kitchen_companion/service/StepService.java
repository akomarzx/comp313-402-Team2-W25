package org.group2.comp313.kitchen_companion.service;

import org.group2.comp313.kitchen_companion.domain.Recipe;
import org.group2.comp313.kitchen_companion.domain.Step;
import org.group2.comp313.kitchen_companion.dto.recipe.ComponentUpdateDto;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeComponentUpdateDto;
import org.group2.comp313.kitchen_companion.dto.recipe.StepDTO;
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

    public Step createStep(StepDTO newStepDto, Integer stepGroupId, String createdBy) {

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

    public void updateStep(StepDTO dto, String updatedBy) {

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
