package org.group2.comp313.kitchen_companion.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.group2.comp313.kitchen_companion.dto.ai.AIMealPlanRecommendationRequest;
import org.group2.comp313.kitchen_companion.dto.ai.AIMealPlanRecommendationResult;
import org.group2.comp313.kitchen_companion.service.MealPlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/meal-plan")
@SecurityRequirement(name = "Keycloak")
@Tag(name = "Meal Plan API")
public class MealPlanController extends BaseController {

    private final MealPlanService mealPlanService;

    public MealPlanController(MealPlanService mealPlanService) {
        this.mealPlanService = mealPlanService;
    }

    @PostMapping("/ai-recommend")
    public ResponseEntity<AIMealPlanRecommendationResult> getAiMealPlanRecommendation(@RequestBody @Valid AIMealPlanRecommendationRequest request) throws Exception {
        return null;
    }
}
