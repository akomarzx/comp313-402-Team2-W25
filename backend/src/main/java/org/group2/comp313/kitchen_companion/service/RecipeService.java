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
import org.group2.comp313.kitchen_companion.mapper.RecipeMapper;
import org.group2.comp313.kitchen_companion.repository.RecipeRepository;
import org.group2.comp313.kitchen_companion.utility.EntityToBeUpdatedNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Objects;

@Service
public class RecipeService extends BaseService {

    private final RecipeRepository recipeRepository;
    private final IngredientGroupService ingredientGroupService;
    private final StepGroupService stepGroupService;
    private final RecipeCategoryService recipeCategoryService;
    private final ChatGptClientService chatGptClientService;
    private final RecipeMapper recipeMapper;

    public RecipeService(RecipeRepository recipeRepository, IngredientGroupService ingredientGroupService, StepGroupService stepGroupService, RecipeCategoryService recipeCategoryService, ChatGptClientService chatGptClientService, RecipeMapper recipeMapper) {
        this.recipeRepository = recipeRepository;
        this.ingredientGroupService = ingredientGroupService;
        this.stepGroupService = stepGroupService;
        this.recipeCategoryService = recipeCategoryService;
        this.chatGptClientService = chatGptClientService;
        this.recipeMapper = recipeMapper;
    }

    @Transactional
    public Recipe getRecipeById(@NotNull Integer id) {
        return recipeRepository.findById(id).orElse(null);
    }

    public Page<RecipeSummaryForCards> getRecipes(Integer page, Integer size) {
        Pageable pageRequest = PageRequest.of(page, size);
        return this.recipeRepository.findAllBy(pageRequest);
    }

    public Page<RecipeSummaryForCards> getRecipesByCreatedBy(String createdBy, Integer page, Integer size) {
        Pageable pageRequest = PageRequest.of(page, size);
        return this.recipeRepository.findAllByCreatedByOrderByIdDesc(createdBy, pageRequest);
    }

    @Transactional
    public Recipe createRecipe(RecipeDTO dto, @NotNull String createdByEmail) {

        try {

            Recipe newRecipe = this.recipeMapper.toRecipe(dto);
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

    @Transactional
    public Boolean updateRecipe(Integer recipeId, RecipeDTO updateRecipeDTO, String updatedByEmail) {

        Recipe recipeToUpdate = this.recipeRepository.findByIdAndCreatedBy(recipeId, updatedByEmail).orElse(null);

        if(recipeToUpdate != null) {

            recipeMapper.partialUpdate(updateRecipeDTO, recipeToUpdate);

            recipeToUpdate.setUpdatedBy(updatedByEmail);
            recipeToUpdate.setUpdatedAt(Instant.now());

            this.recipeRepository.save(recipeToUpdate);

           return true;

        } else {
            throw new EntityToBeUpdatedNotFoundException("Recipe with id " + recipeId + " not found or does not belong to user.");
        }
    }

}
