package org.group2.comp313.kitchen_companion.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotNull;
import org.group2.comp313.kitchen_companion.domain.Recipe;
import org.group2.comp313.kitchen_companion.domain.projection.RecipeSummaryForCards;
import org.group2.comp313.kitchen_companion.dto.ai.AIRecipeRecommendationResult;
import org.group2.comp313.kitchen_companion.dto.ai.ChatCompletionResponse;
import org.group2.comp313.kitchen_companion.dto.ai.AIRecipeRecommendationRequest;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeDTO;
import org.group2.comp313.kitchen_companion.repository.RecipeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class RecipeService extends BaseService {

    private final RecipeRepository recipeRepository;
    private final StaticCodeService staticCodeService;
    private final IngredientGroupService ingredientGroupService;
    private final StepGroupService stepGroupService;
    private final RecipeCategoryService recipeCategoryService;
    private final ChatGptClientService chatGptClientService;

    public RecipeService(RecipeRepository recipeRepository, StaticCodeService staticCodeService, IngredientGroupService ingredientGroupService, StepGroupService stepGroupService, RecipeCategoryService recipeCategoryService, ChatGptClientService chatGptClientService) {
        this.recipeRepository = recipeRepository;
        this.staticCodeService = staticCodeService;
        this.ingredientGroupService = ingredientGroupService;
        this.stepGroupService = stepGroupService;
        this.recipeCategoryService = recipeCategoryService;
        this.chatGptClientService = chatGptClientService;
    }

    @Transactional
    public Recipe getRecipeById(@NotNull Integer id) {
        return recipeRepository.findById(id).orElse(null);
    }

    public Page<RecipeSummaryForCards> getRecipes(Integer page, Integer size) {
        Pageable pageRequest = PageRequest.of(page, size);
        return this.recipeRepository.findAllBy(pageRequest);
    }

    @Transactional
    public Recipe createRecipe(RecipeDTO dto, @NotNull String createdByEmail) {
        try {
            Recipe newRecipe = mapDtoToRecipe(dto);
            newRecipe.setCreatedBy(createdByEmail);
            newRecipe.setCreatedAt(Instant.now());
            newRecipe.setUpdatedBy(null);
            newRecipe.setUpdatedAt(null);

            newRecipe = this.recipeRepository.save(newRecipe);

            for(Integer categoryId : dto.categoryIds()) {
                this.recipeCategoryService.createRecipeCategory(categoryId, newRecipe.getId(), createdByEmail);
            }

            newRecipe.setIngredientGroups(this.ingredientGroupService.createIngredientGroups(dto.ingredientGroups(), newRecipe.getId(), createdByEmail));
            newRecipe.setStepGroups(this.stepGroupService.createStepGroup(dto.stepGroups(), newRecipe.getId(), createdByEmail));

            return newRecipe;

        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
            return null;
        }
    }

    public AIRecipeRecommendationResult getAiRecipeRecommendation(AIRecipeRecommendationRequest aiRecipeRecommendationRequest) throws JsonProcessingException {

        ChatCompletionResponse response = this.chatGptClientService.getRecipeRecommendations(aiRecipeRecommendationRequest);

        ObjectMapper mapper = new ObjectMapper();

        String jsonDirty = response.choices().getFirst().message().content();
        String cleanedJson = jsonDirty.replaceAll("^```json\\s*", "").replaceAll("```$", "");

        try {
            return mapper.readValue(cleanedJson, AIRecipeRecommendationResult.class);
        }
        catch (Exception e) {
            log.error(e.getMessage(), e);
            throw e;
        }
    }

    private Recipe mapDtoToRecipe(RecipeDTO dto) {
        Recipe newRecipe = new Recipe();
        newRecipe.setTitle(dto.title());
        newRecipe.setSummary(dto.summary());
        newRecipe.setPrepTime(dto.prepTime());
        newRecipe.setCookTime(dto.cookTime());
        newRecipe.setServings(dto.servings());
        newRecipe.setYield(dto.yield());
        newRecipe.setImageUrl(dto.imageUrl());
        newRecipe.setThumbnailUrl(dto.thumbnailUrl());
        newRecipe.setCalories(dto.calories());
        newRecipe.setCarbsG(dto.carbsG());
        newRecipe.setFatG(dto.fatG());
        newRecipe.setSugarsG(dto.sugarsG());
        newRecipe.setCookTimeUnitCd(this.staticCodeService.getCodeValueUsingCodeValueId(dto.cookTimeUnitCd()).get());
        newRecipe.setPrepTimeUnitCd(this.staticCodeService.getCodeValueUsingCodeValueId(dto.prepTimeUnitCd()).get());
        return newRecipe;
    }
}
