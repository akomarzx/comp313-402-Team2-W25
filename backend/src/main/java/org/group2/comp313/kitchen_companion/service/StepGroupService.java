package org.group2.comp313.kitchen_companion.service;

import org.group2.comp313.kitchen_companion.domain.StepGroup;
import org.group2.comp313.kitchen_companion.dto.recipe.StepGroupDTO;
import org.group2.comp313.kitchen_companion.repository.StepGroupRepository;
import org.springframework.stereotype.Service;

@Service
public class StepGroupService extends BaseService {

    private final StepGroupRepository stepGroupRepository;

    public StepGroupService(StepGroupRepository stepGroupRepository) {
        this.stepGroupRepository = stepGroupRepository;
    }

    public StepGroup createStepGroup(StepGroupDTO newStepGroup) {
        return null;
    }
}
