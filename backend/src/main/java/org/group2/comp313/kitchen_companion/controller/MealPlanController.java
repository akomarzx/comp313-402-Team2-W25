package org.group2.comp313.kitchen_companion.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.group2.comp313.kitchen_companion.dto.ApiResult;
import org.group2.comp313.kitchen_companion.dto.ai.AIMealPlanRecommendationRequest;
import org.group2.comp313.kitchen_companion.dto.ai.AIMealPlanRecommendationResult;
import org.group2.comp313.kitchen_companion.dto.ai.AIRecipeRecommendationResult;
import org.group2.comp313.kitchen_companion.dto.meal_plan.MealPlanSummaryDto;
import org.group2.comp313.kitchen_companion.service.MealPlanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public ResponseEntity<ApiResult<MealPlanSummaryDto>> getAiMealPlanRecommendation(@RequestBody @Valid AIMealPlanRecommendationRequest request,
                                                                                     @AuthenticationPrincipal(expression = "claims['email']") String createdByEmail) throws Exception {

        log.info("Received AIMealPlanRecommendationRequest: {}", request);

        try {
            return ResponseEntity.ok(this.mealPlanService.getAiMealPlanRecommendation(request, createdByEmail));
        } catch (Exception e) {
            log.error(e.getLocalizedMessage(), e);
            return new ResponseEntity<>(new ApiResult<>(e.getLocalizedMessage(), null), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
