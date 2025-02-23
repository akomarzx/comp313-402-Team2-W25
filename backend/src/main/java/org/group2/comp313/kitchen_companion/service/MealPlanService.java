package org.group2.comp313.kitchen_companion.service;

import org.group2.comp313.kitchen_companion.dto.meal_plan.MealPlanDaysSummaryDto;
import org.group2.comp313.kitchen_companion.repository.MealPlanDayRepository;
import org.group2.comp313.kitchen_companion.repository.MealPlanGroupRepository;
import org.group2.comp313.kitchen_companion.repository.MealPlanRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MealPlanService extends BaseService {

    private final MealPlanGroupRepository mealPlanGroupRepository;
    private final MealPlanRepository mealPlanRepository;
    private final MealPlanDayRepository mealPlanDayRepository;

    public MealPlanService(MealPlanGroupRepository mealPlanGroupRepository, MealPlanRepository mealPlanRepository, MealPlanDayRepository mealPlanDayRepository) {
        this.mealPlanGroupRepository = mealPlanGroupRepository;
        this.mealPlanRepository = mealPlanRepository;
        this.mealPlanDayRepository = mealPlanDayRepository;
    }

    public List<MealPlanDaysSummaryDto> findAllMealPlanDaySummaryDtoById(Integer id) {
        return this.mealPlanDayRepository.findMealPlanDaySummaryDtoByMealPlanGroup(id);
    }

}
