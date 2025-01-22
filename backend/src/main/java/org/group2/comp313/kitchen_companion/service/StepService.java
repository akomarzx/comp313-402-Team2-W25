package org.group2.comp313.kitchen_companion.service;

import org.group2.comp313.kitchen_companion.domain.Step;
import org.group2.comp313.kitchen_companion.dto.recipe.StepDTO;
import org.group2.comp313.kitchen_companion.repository.StepRepository;
import org.springframework.stereotype.Service;

@Service
public class StepService extends BaseService {

    private final StepRepository stepRepository;

    public StepService(StepRepository stepRepository) {
        this.stepRepository = stepRepository;
    }

    public Step createStep(StepDTO newStep) {
        return null;
    }
}
