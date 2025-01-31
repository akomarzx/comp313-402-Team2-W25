package org.group2.comp313.kitchen_companion.service;

import org.group2.comp313.kitchen_companion.domain.Step;
import org.group2.comp313.kitchen_companion.dto.recipe.StepDTO;
import org.group2.comp313.kitchen_companion.repository.StepRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class StepService extends BaseService {

    private final StepRepository stepRepository;

    public StepService(StepRepository stepRepository) {
        this.stepRepository = stepRepository;
    }

    public void createStep(StepDTO newStepDto, Integer stepGroupId, String createdBy) {

        Step newStep = new Step();

        newStep.setStepGroup(stepGroupId);
        newStep.setStepOrder(newStepDto.stepOrder());
        newStep.setImageUrl(newStepDto.imageUrl());
        newStep.setLabel(newStepDto.label());
        newStep.setCreatedBy(createdBy);
        newStep.setCreatedAt(Instant.now());
        newStep.setUpdatedAt(null);
        newStep.setUpdatedBy(null);

        stepRepository.save(newStep);
    }
}
