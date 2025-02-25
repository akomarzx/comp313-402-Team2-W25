package org.group2.comp313.kitchen_companion.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.transaction.Transactional;
import org.group2.comp313.kitchen_companion.domain.MealPlan;
import org.group2.comp313.kitchen_companion.dto.ApiResult;
import org.group2.comp313.kitchen_companion.dto.ai.AIMealPlanRecommendationRequest;
import org.group2.comp313.kitchen_companion.dto.ai.AIMealPlanRecommendationResult;
import org.group2.comp313.kitchen_companion.dto.ai.ChatCompletionResponse;
import org.group2.comp313.kitchen_companion.dto.meal_plan.MealPlanDaysSummaryDto;
import org.group2.comp313.kitchen_companion.dto.meal_plan.MealPlanSummaryDto;
import org.group2.comp313.kitchen_companion.repository.MealPlanDayRepository;
import org.group2.comp313.kitchen_companion.repository.MealPlanGroupRepository;
import org.group2.comp313.kitchen_companion.repository.MealPlanRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class MealPlanService extends BaseService {

    private final MealPlanGroupRepository mealPlanGroupRepository;
    private final MealPlanRepository mealPlanRepository;
    private final MealPlanDayRepository mealPlanDayRepository;
    private final ChatGptClientService chatGptClientService;
    private final RecipeService recipeService;

    public MealPlanService(MealPlanGroupRepository mealPlanGroupRepository, MealPlanRepository mealPlanRepository, MealPlanDayRepository mealPlanDayRepository, ChatGptClientService chatGptClientService, RecipeService recipeService) {
        this.mealPlanGroupRepository = mealPlanGroupRepository;
        this.mealPlanRepository = mealPlanRepository;
        this.mealPlanDayRepository = mealPlanDayRepository;
        this.chatGptClientService = chatGptClientService;
        this.recipeService = recipeService;
    }

    public List<MealPlanDaysSummaryDto> findAllMealPlanDaySummaryDtoById(Integer id) {
        return this.mealPlanDayRepository.findMealPlanDaySummaryDtoByMealPlanGroup(id);
    }

    /**
     * Retrieves AI-generated Meal plan recommendations based on the provided request.
     *
     * @param aiMealPlanRecommendationRequest the request object containing the parameters for generating meal plan recommendations
     * @return an AIRecipeRecommendationResult object containing the recommended recipes and related information
     * @throws JsonProcessingException if there is an error processing the JSON response
     */
    @Transactional
    public ApiResult<MealPlanSummaryDto> getAiMealPlanRecommendation(AIMealPlanRecommendationRequest aiMealPlanRecommendationRequest, String createdBy) throws Exception {
        ChatCompletionResponse response = this.chatGptClientService.getMealPlanAIRecommendation(aiMealPlanRecommendationRequest);
        AIMealPlanRecommendationResult recommendationResult = deserializeChatResponse(response, AIMealPlanRecommendationResult.class);
        return this.processAiMealPlanResponse(recommendationResult, createdBy);
    }

    public MealPlan createMealPlan(String label, String createdBy) {
        MealPlan mealPlan = new MealPlan();
        mealPlan.setLabel(label);
        mealPlan.setCreatedBy(createdBy);
        mealPlan.setCreatedAt(Instant.now());
        return this.mealPlanRepository.save(mealPlan);
    }

    private ApiResult<MealPlanSummaryDto> processAiMealPlanResponse(AIMealPlanRecommendationResult aiMealPlanRecommendationResult, String createdBy) {

        String mealPlanLabel = null;

        if(aiMealPlanRecommendationResult.success()) {
            mealPlanLabel = aiMealPlanRecommendationResult.mealPlanGroup().getFirst().label();
            MealPlan createdMealPlan = this.createMealPlan(mealPlanLabel, createdBy);

            return null;
        } else {
            return new ApiResult<>("AI Failed to generate meal plan - " + aiMealPlanRecommendationResult.reasonForFail() , null);
        }
    }
}
