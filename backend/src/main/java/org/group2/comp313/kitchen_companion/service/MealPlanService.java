package org.group2.comp313.kitchen_companion.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.transaction.Transactional;
import org.group2.comp313.kitchen_companion.domain.MealPlan;
import org.group2.comp313.kitchen_companion.domain.MealPlanDay;
import org.group2.comp313.kitchen_companion.domain.MealPlanGroup;
import org.group2.comp313.kitchen_companion.domain.Recipe;
import org.group2.comp313.kitchen_companion.dto.ApiResult;
import org.group2.comp313.kitchen_companion.dto.ai.AIMealPlanRecommendationRequest;
import org.group2.comp313.kitchen_companion.dto.ai.AIMealPlanRecommendationResult;
import org.group2.comp313.kitchen_companion.dto.ai.ChatCompletionResponse;
import org.group2.comp313.kitchen_companion.dto.meal_plan.*;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeSummaryForCards;
import org.group2.comp313.kitchen_companion.repository.MealPlanDayRepository;
import org.group2.comp313.kitchen_companion.repository.MealPlanGroupRepository;
import org.group2.comp313.kitchen_companion.repository.MealPlanRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

    public ApiResult<MealPlanSummaryDto> getMealPlanGroupSummary(Integer id) {

        MealPlan mealPlan = mealPlanRepository.findById(id).orElse(null);

        if (mealPlan == null) {
            return new ApiResult<>("Meal Plan not found", null);
        } else {

            List<MealPlanGroup> mealPlanGroups = mealPlanGroupRepository.findAllByMealPlan(mealPlan.getId());
            List<MealPlanGroupSummaryDto> mealPlanGroupSummaryDtoList = new ArrayList<>();

            for(MealPlanGroup mpg : mealPlanGroups) {
                List<MealPlanDaysSummaryDto> mealPlanDaysSummaryDtoList = this.mealPlanDayRepository.findMealPlanDaySummaryDtoByMealPlanGroup(mpg.getId());
                mealPlanGroupSummaryDtoList.add(new MealPlanGroupSummaryDto(mpg.getId(), mpg.getLabel(), mealPlanDaysSummaryDtoList));
            }

            MealPlanSummaryDto result = new MealPlanSummaryDto(mealPlan.getId(), mealPlan.getLabel(), mealPlan.getCreatedAt(), mealPlan.getCreatedBy(), mealPlanGroupSummaryDtoList);

            return new ApiResult<>("Meal Plan Summary", result);
        }
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

    @Transactional
    public ApiResult<MealPlanSummaryDto> createMealPlanFromRequest(CreateMealPlanDto createMealPlanDto, String createdBy) throws Exception {
        return this.processMealPlanRequest(createMealPlanDto, createdBy);
    }

    @Transactional
    public ApiResult<Boolean> updateMealPlanDay(Integer mealPlanDayId, CreateMealPlanDto.CreateMealPlanDaysSummary request, String updatedBy) {
        Optional<MealPlanDay> findMealPlanDay = mealPlanDayRepository.findById(mealPlanDayId);
        if (findMealPlanDay.isEmpty()) {
            return new ApiResult<>("Meal Plan Day not found", false);
        } else {
            MealPlanDay mealPlanDay = findMealPlanDay.get();
            mealPlanDay.setCreatedAt(Instant.now());
            mealPlanDay.setUpdatedAt(Instant.now());
            mealPlanDay.setUpdatedBy(updatedBy);

            mealPlanDay.setBreakfastRecipeSubstituteCd(request.breakfastSubstituteCode());
            mealPlanDay.setBreakfastRecipe(request.breakfastRecipeId());

            mealPlanDay.setLunchRecipeSubstituteCd(request.lunchSubstituteCode());
            mealPlanDay.setLunchRecipe(request.lunchRecipeId());

            mealPlanDay.setDinnerRecipeSubstituteCd(request.dinnerSubstituteCode());
            mealPlanDay.setBreakfastRecipe(request.breakfastRecipeId());

            this.mealPlanDayRepository.save(mealPlanDay);

            return new ApiResult<>("Meal Plan Day updated", true);
        }
    }

    private MealPlan createMealPlan(String label, String createdBy) {
        MealPlan mealPlan = new MealPlan();
        mealPlan.setLabel(label);
        mealPlan.setCreatedBy(createdBy);
        mealPlan.setCreatedAt(Instant.now());
        return this.mealPlanRepository.save(mealPlan);
    }

    private MealPlanGroup createMealPlanGroup(Integer mealPlanId ,String createdBy) {

        MealPlanGroup mealPlanGroup = new MealPlanGroup();
        mealPlanGroup.setCreatedBy(createdBy);
        mealPlanGroup.setCreatedAt(Instant.now());
        mealPlanGroup.setMealPlan(mealPlanId);

        // Get The current Count to create label for the Meal Plan group for ex: Week 1 or something
        // Meal Plan Are group weekly for easier development
        // Will Improve Later;
        Integer countByMealPlanId = this.mealPlanGroupRepository.countByMealPlan(mealPlanId);
        int currentWeekLabelCount = countByMealPlanId + 1;
        mealPlanGroup.setLabel("Week " + currentWeekLabelCount);

        return this.mealPlanGroupRepository.save(mealPlanGroup);
    }


    /**
     * Create a meal plan day entity from the AI Result.
     * **/
    private void createMealPlanDayFromAIResult(AIMealPlanRecommendationResult.MealPlanDay mealPlanDay, Integer mealPlanGroupId, String createdBy) {
        MealPlanDay newMealPlanDay = new MealPlanDay();

        newMealPlanDay.setCreatedAt(Instant.now());
        newMealPlanDay.setCreatedBy(createdBy);
        newMealPlanDay.setDayOfWeekCode(mealPlanDay.daysOfWeekCd());
        newMealPlanDay.setMealPlanGroup(mealPlanGroupId);

        Recipe breakFastRecipe = this.recipeService.createRecipe(mealPlanDay.breakfastRecipe(), createdBy);
        Recipe lunchRecipe = this.recipeService.createRecipe(mealPlanDay.lunchRecipe(), createdBy);
        Recipe dinnerRecipe = this.recipeService.createRecipe(mealPlanDay.dinnerRecipe(), createdBy);

        newMealPlanDay.setBreakfastRecipe(breakFastRecipe.getId());
        newMealPlanDay.setLunchRecipe(lunchRecipe.getId());
        newMealPlanDay.setDinnerRecipe(dinnerRecipe.getId());

        this.mealPlanDayRepository.save(newMealPlanDay);
    }

    private void createMealPlanDayFromRequest(CreateMealPlanDto.CreateMealPlanDaysSummary mealPlanDaysSummary, Integer mealPlanGroupId, String createdBy) {

        MealPlanDay newMealPlanDay = new MealPlanDay();

        newMealPlanDay.setCreatedAt(Instant.now());
        newMealPlanDay.setCreatedBy(createdBy);
        newMealPlanDay.setDayOfWeekCode(mealPlanDaysSummary.daysOfWeekCd());
        newMealPlanDay.setMealPlanGroup(mealPlanGroupId);

        newMealPlanDay.setBreakfastRecipe(mealPlanDaysSummary.breakfastRecipeId());
        newMealPlanDay.setLunchRecipe(mealPlanDaysSummary.lunchRecipeId());
        newMealPlanDay.setDinnerRecipe(mealPlanDaysSummary.dinnerRecipeId());

        newMealPlanDay.setBreakfastRecipeSubstituteCd(mealPlanDaysSummary.breakfastSubstituteCode());
        newMealPlanDay.setBreakfastRecipeSubstituteCd(mealPlanDaysSummary.lunchSubstituteCode());
        newMealPlanDay.setBreakfastRecipeSubstituteCd(mealPlanDaysSummary.dinnerSubstituteCode());

        this.mealPlanDayRepository.save(newMealPlanDay);
    }

    private ApiResult<MealPlanSummaryDto> processMealPlanRequest(CreateMealPlanDto createMealPlanDto, String createdBy) {

        String mealPlanLabel = createMealPlanDto.label();
        Instant createdAt = Instant.now();

        List<MealPlanGroupSummaryDto> mealPlanGroupSummaryDtoList = new ArrayList<>();

        if (mealPlanLabel != null && createMealPlanDto.mealPlanGroupSummaryDtoList() != null) {

            // Create Meal Plan
            MealPlan createdMealPlan = this.createMealPlan(mealPlanLabel, createdBy);

            for (CreateMealPlanDto.CreateMealPlanGroupSummary mealPlanGroup : createMealPlanDto.mealPlanGroupSummaryDtoList()) {

                // Create Meal Plan Group
                MealPlanGroup newMealPlanGroup = this.createMealPlanGroup(createdMealPlan.getId(), createdBy);

                for (CreateMealPlanDto.CreateMealPlanDaysSummary mealPlanDay : mealPlanGroup.mealPlanDaysSummaryDtoList()) {
                    createMealPlanDayFromRequest(mealPlanDay, newMealPlanGroup.getId(), createdBy);
                }

                // Retrieve all meal plan days summary for the meal plan group.
                List<MealPlanDaysSummaryDto> mealPlanDaysSummaryDtoList = this.mealPlanDayRepository.findMealPlanDaySummaryDtoByMealPlanGroup(newMealPlanGroup.getId());
                mealPlanGroupSummaryDtoList.add(new MealPlanGroupSummaryDto(newMealPlanGroup.getId(), newMealPlanGroup.getLabel(), mealPlanDaysSummaryDtoList));
            }

            // Return API response after processing the request
            return new ApiResult<>("Meal plan created successfully.", new MealPlanSummaryDto(createdMealPlan.getId(), mealPlanLabel, createdAt, createdBy, mealPlanGroupSummaryDtoList));

        } else {
            return new ApiResult<>("Invalid meal plan request - missing required data", null);
        }
    }


    private ApiResult<MealPlanSummaryDto> processAiMealPlanResponse(AIMealPlanRecommendationResult aiMealPlanRecommendationResult, String createdBy) {

        String mealPlanLabel = null;
        Instant createdAt = Instant.now();

        List<MealPlanGroupSummaryDto> mealPlanGroupSummaryDtoList = new ArrayList<>();

        if(aiMealPlanRecommendationResult.success()) {

            mealPlanLabel = aiMealPlanRecommendationResult.mealPlanTitle();
            MealPlan createdMealPlan = this.createMealPlan(mealPlanLabel, createdBy);
            MealPlanGroup newMealPlanGroup = this.createMealPlanGroup(createdMealPlan.getId(), createdBy);

            for(AIMealPlanRecommendationResult.MealPlanDay mealPlanDay : aiMealPlanRecommendationResult.mealPlanDays()) {
                createMealPlanDayFromAIResult(mealPlanDay, newMealPlanGroup.getId(), createdBy);
            }

            // Retrieve all meal plan days summary for the meal plan summary group.
            List<MealPlanDaysSummaryDto> mealPlanDaysSummaryDtoList = this.mealPlanDayRepository.findMealPlanDaySummaryDtoByMealPlanGroup(newMealPlanGroup.getId());
            mealPlanGroupSummaryDtoList.add(new MealPlanGroupSummaryDto(newMealPlanGroup.getId(), newMealPlanGroup.getLabel(), mealPlanDaysSummaryDtoList));

            // After all records are inserted query the database for the meal Plan Days
            return new ApiResult<>("Meal plan created successfully.", new MealPlanSummaryDto(createdMealPlan.getId() ,mealPlanLabel, createdAt, createdBy, mealPlanGroupSummaryDtoList));

        } else {
            return new ApiResult<>("AI Failed to generate meal plan - " + aiMealPlanRecommendationResult.reasonForFail() , null);
        }
    }

    public Page<MealPlan> getMealPlansForUser( Integer page, Integer size, String createdBy) {
        Pageable pageRequest = PageRequest.of(page, size);
        return this.mealPlanRepository.findAllByCreatedBy(createdBy, pageRequest);
    }
}
