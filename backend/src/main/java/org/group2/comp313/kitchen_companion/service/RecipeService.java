package org.group2.comp313.kitchen_companion.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotNull;
import org.group2.comp313.kitchen_companion.domain.Category;
import org.group2.comp313.kitchen_companion.domain.Recipe;
import org.group2.comp313.kitchen_companion.domain.SavedRecipe;
import org.group2.comp313.kitchen_companion.domain.projection.RecipeSummaryForCards;
import org.group2.comp313.kitchen_companion.dto.ai.AIRecipeRecommendationResult;
import org.group2.comp313.kitchen_companion.dto.ai.ChatCompletionResponse;
import org.group2.comp313.kitchen_companion.dto.ai.AIRecipeRecommendationRequest;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeDto;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeSummaryCardWithCategory;
import org.group2.comp313.kitchen_companion.mapper.RecipeMapper;
import org.group2.comp313.kitchen_companion.repository.RecipeRepository;
import org.group2.comp313.kitchen_companion.repository.SavedRecipeRepository;
import org.group2.comp313.kitchen_companion.utility.EntityToBeUpdatedNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RecipeService extends BaseService {

    private final RecipeRepository recipeRepository;
    private final IngredientGroupService ingredientGroupService;
    private final StepGroupService stepGroupService;
    private final RecipeCategoryService recipeCategoryService;
    private final ChatGptClientService chatGptClientService;
    private final RecipeMapper recipeMapper;
    private final SavedRecipeRepository savedRecipeRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public RecipeService(RecipeRepository recipeRepository, IngredientGroupService ingredientGroupService, StepGroupService stepGroupService, RecipeCategoryService recipeCategoryService, ChatGptClientService chatGptClientService, RecipeMapper recipeMapper, SavedRecipeRepository savedRecipeRepository) {
        this.recipeRepository = recipeRepository;
        this.ingredientGroupService = ingredientGroupService;
        this.stepGroupService = stepGroupService;
        this.recipeCategoryService = recipeCategoryService;
        this.chatGptClientService = chatGptClientService;
        this.recipeMapper = recipeMapper;
        this.savedRecipeRepository = savedRecipeRepository;
    }

    @Transactional
    public Recipe getRecipeById(@NotNull Integer id) {
        return recipeRepository.findById(id).orElse(null);
    }

    public Page<RecipeSummaryCardWithCategory> getRecipes(Integer page, Integer size) {
        Pageable pageRequest = PageRequest.of(page, size);
        return this.recipeRepository.findAllRecipeSummaryCards(pageRequest);
    }

    public Page<RecipeSummaryForCards> getRecipesByCreatedBy(String createdBy, Integer page, Integer size) {
        Pageable pageRequest = PageRequest.of(page, size);
        return this.recipeRepository.findAllByCreatedByOrderByIdDesc(createdBy, pageRequest);
    }

    @Transactional
    public Recipe createRecipe(RecipeDto dto, @NotNull String createdByEmail) {

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

            // Just wanted to return categories of the new recipe. If entity is not detached it will try to persist the category which will break stuff
            this.entityManager.detach(newRecipe);

            newRecipe.setCategories(this.recipeRepository.findCategoriesByRecipeId(newRecipe.getId()));

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
    public Boolean updateRecipe(Integer recipeId, RecipeDto updateRecipeDto, String updatedByEmail) {

        Recipe recipeToUpdate = this.recipeRepository.findByIdAndCreatedBy(recipeId, updatedByEmail).orElse(null);

        if(recipeToUpdate != null) {

            recipeMapper.partialUpdate(updateRecipeDto, recipeToUpdate);

            recipeToUpdate.setUpdatedBy(updatedByEmail);
            recipeToUpdate.setUpdatedAt(Instant.now());
            this.updateRecipeCategory(recipeToUpdate.getCategories(), updateRecipeDto.categoryIds(), recipeToUpdate.getId(), updatedByEmail);

            this.recipeRepository.save(recipeToUpdate);

           return true;

        } else {
            throw new EntityToBeUpdatedNotFoundException("Recipe with id " + recipeId + " not found or does not belong to user.");
        }
    }

    @Transactional
    protected void updateRecipeCategory(Set<Category> categories, Set<Integer> categoryIds, Integer recipeId, String updatedByEmail) {

        Set<Integer> existingCategoryIds = categories.stream().map(Category::getId).collect(Collectors.toSet());

        if(!(existingCategoryIds.equals(categoryIds) && categories.size() == categoryIds.size())) {

            Set<Integer> categoryIdsToRemove = existingCategoryIds.stream().filter(id -> !categoryIds.contains(id)).collect(Collectors.toSet());
            Set<Integer> newCategoryIds = categoryIds.stream().filter(id -> !existingCategoryIds.contains(id)).collect(Collectors.toSet());

            for(Integer categoryId : categoryIdsToRemove) {
                this.recipeCategoryService.deleteRecipeCategory(categoryId, recipeId);
            }

            for(Integer categoryId : newCategoryIds) {
                this.recipeCategoryService.createRecipeCategory(categoryId, recipeId, updatedByEmail);
            }
        }
    }

    public void saveRecipeForUser(Integer recipeId, String userEmail) {

        SavedRecipe savedRecipe = this.savedRecipeRepository.findOneByRecipeAndCreatedBy(recipeId, userEmail).orElse(null);

        if(savedRecipe == null) {
            SavedRecipe newSavedRecipe = new SavedRecipe();
            newSavedRecipe.setCreatedBy(userEmail);
            newSavedRecipe.setCreatedAt(Instant.now());
            //newSavedRecipe.setRecipe(recipeId);
            this.savedRecipeRepository.save(newSavedRecipe);
        }
    }

    public void removeSavedRecipe(Integer recipeId, String userEmail) {

        SavedRecipe savedRecipe = this.savedRecipeRepository.findOneByRecipeAndCreatedBy(recipeId, userEmail).orElse(null);

        if(savedRecipe != null) {
            this.savedRecipeRepository.delete(savedRecipe);
        }
    }

    public Page<RecipeSummaryForCards> getSavedRecipeForUser(Integer page, Integer size, String userEmail) {
        Pageable pageRequest = PageRequest.of(page, size);
        return this.recipeRepository.findSavedRecipeSummaryCardsByUser(userEmail, pageRequest);
    }
}
