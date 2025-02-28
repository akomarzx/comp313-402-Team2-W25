package org.group2.comp313.kitchen_companion.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.group2.comp313.kitchen_companion.dto.ApiResult;
import org.group2.comp313.kitchen_companion.dto.ai.AIMealPlanRecommendationRequest;
import org.group2.comp313.kitchen_companion.dto.meal_plan.CreateMealPlanDto;
import org.group2.comp313.kitchen_companion.dto.meal_plan.MealPlanSummaryDto;
import org.group2.comp313.kitchen_companion.service.MealPlanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/meal-plan")
@SecurityRequirement(name = "Keycloak")
@Tag(name = "Meal Plan API")
public class MealPlanController extends BaseController {

    private final MealPlanService mealPlanService;

    public MealPlanController(MealPlanService mealPlanService) {
        this.mealPlanService = mealPlanService;
    }

    @GetMapping("{mealPlanId}")
    public ResponseEntity<ApiResult<MealPlanSummaryDto>> getMealPlanById(@PathVariable("mealPlanId") Integer id,
                                                                         @AuthenticationPrincipal(expression = "claims['email']") String createdByEmail) {

        try {
            ApiResult<MealPlanSummaryDto> mealPlanSummaryDtoApiResult = this.mealPlanService.getMealPlanGroupSummary(id);

            if(mealPlanSummaryDtoApiResult.result() == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            return ResponseEntity.ok(mealPlanSummaryDtoApiResult);

        } catch (Exception e) {
            log.error(e.getLocalizedMessage(), e);
            return new ResponseEntity<>(new ApiResult<>(e.getLocalizedMessage(), null), HttpStatus.INTERNAL_SERVER_ERROR);
        }
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

    @PostMapping("")
    public ResponseEntity<ApiResult<MealPlanSummaryDto>> createMealPlan(@RequestBody @Valid CreateMealPlanDto request,
                                                                        @AuthenticationPrincipal(expression = "claims['email']") String updatedBy) throws Exception {

        log.info("Received Create Meal Plan Request: {}", request);

        try {
            return ResponseEntity.ok(this.mealPlanService.createMealPlanFromRequest(request, updatedBy));

        } catch (Exception e) {
            log.error(e.getLocalizedMessage(), e);
            return new ResponseEntity<>(new ApiResult<>(e.getLocalizedMessage(), null), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("{mealPlanDayId}")
    public ResponseEntity<ApiResult<Boolean>> updateMealPlanDay(@PathVariable("mealPlanDayId") Integer mealPlanDayId,
                                                                @NotNull @Valid @RequestBody CreateMealPlanDto.CreateMealPlanDaysSummary request,
                                                                @AuthenticationPrincipal(expression = "claims['email']") String createdByEmail) {

        log.info("Request to update meal plan day: {}", request.toString());

        try {
            ApiResult<Boolean> result = this.mealPlanService.updateMealPlanDay(mealPlanDayId, request, createdByEmail);
            return new ResponseEntity<>(result, result.result() ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResult<>(e.getLocalizedMessage(), false), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
