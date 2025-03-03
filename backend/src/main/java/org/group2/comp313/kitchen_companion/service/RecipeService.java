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
import org.group2.comp313.kitchen_companion.dto.ai.*;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeDto;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeSummaryCardWithCategory;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeSummaryForCards;
import org.group2.comp313.kitchen_companion.mapper.RecipeMapper;
import org.group2.comp313.kitchen_companion.repository.RecipeRepository;
import org.group2.comp313.kitchen_companion.repository.SavedRecipeRepository;
import org.group2.comp313.kitchen_companion.utility.EntityToBeUpdatedNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
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

    /**
     * Retrieves a recipe by its unique identifier.
     *
     * @param id the unique identifier of the recipe to retrieve; must not be null
     * @return the Recipe object if found, or null if no recipe is found with the given identifier
     */
    @Transactional
    public Recipe getRecipeById(@NotNull Integer id, String userEmail) {

         Recipe recipe = recipeRepository.findById(id).orElse(null);

         if (recipe != null) {
             SavedRecipe savedRecipe = savedRecipeRepository.findOneByRecipeAndCreatedBy(id, userEmail).orElse(null);
             recipe.setIsFavorite(savedRecipe != null);
             return recipe;
         } else {
             return null;
         }
    }

    /**
     * Retrieves a paginated list of recipe summaries filtered by a keyword and sorted based on the provided parameters.
     *
     * @param keyword the search keyword to filter recipes; can be null or empty for no keyword filtering.
     * @param page the page number for pagination, starting from 0.
     * @param size the number of records per page.
     * @param sort an array of sorting parameters where the first element specifies the property name,
     *             and the second element (optional) specifies the direction ("asc" or "desc").
     * @return a paginated {@code Page<RecipeSummaryCardWithCategory>} containing recipe summaries filtered
     *         by the given keyword and sorted as specified.
     */
    public Page<RecipeSummaryCardWithCategory> getRecipes(String keyword, String categoryLabel, Integer page, Integer size, String[] sort, String currentUserEmail) {

        Pageable pageable;

        if (sort != null && sort.length > 0) {

            List<Sort.Order> orders = new ArrayList<>();

            if (sort.length == 2 &&
                    ("asc".equalsIgnoreCase(sort[1]) || "desc".equalsIgnoreCase(sort[1]))) {
                String combined = sort[0] + "," + sort[1];
                sort = new String[] { combined };
            }

            for (String sortParam : sort) {
                String[] sortParts = sortParam.split(",");
                if (sortParts.length == 2) {
                    String property = sortParts[0];
                    Sort.Direction direction = Sort.Direction.fromString(sortParts[1]);
                    orders.add(new Sort.Order(direction, property));
                }
            }

            pageable = PageRequest.of(page, size, Sort.by(orders));

        } else {
            pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        }

        return recipeRepository.findRecipeSummaryCardsByKeywordAndSort(keyword, currentUserEmail, categoryLabel,pageable);
    }

    /**
     * Retrieves a paginated list of recipes created by a specified user.
     *
     * @param createdBy the unique identifier of the user who created the recipes
     * @param page the page number to retrieve (zero-based index)
     * @param size the number of recipes per page
     * @return a paginated list of recipes in the form of a Page object containing RecipeSummaryForCards
     */
    public Page<RecipeSummaryForCards> getRecipesByCreatedBy(String createdBy, Integer page, Integer size) {
        Pageable pageRequest = PageRequest.of(page, size);
        return this.recipeRepository.findAllByCreatedByOrderByIdDesc(createdBy, pageRequest);
    }

    /**
     * Creates a new recipe and saves it to the database. The method maps the provided
     * {@link RecipeDto} to a {@link Recipe} entity, saves it, and associates the recipe with
     * its corresponding categories, ingredient groups, and step groups.
     *
     * @param dto The data transfer object containing the details of the recipe to be created.
     * @param createdByEmail The email address of the user who is creating the recipe.
     * @return The newly created {@link Recipe}, with its associated categories, ingredient groups,
     *         and step groups populated, or null if an error occurs during the operation.
     */
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

    /**
     * Retrieves AI-generated recipe recommendations based on the provided request.
     *
     * @param aiRecipeRecommendationRequest the request object containing the parameters for generating recipe recommendations
     * @return an AIRecipeRecommendationResult object containing the recommended recipes and related information
     * @throws JsonProcessingException if there is an error processing the JSON response
     */
    public AIRecipeRecommendationResult getAiRecipeRecommendation(AIRecipeRecommendationRequest aiRecipeRecommendationRequest) throws Exception {

        ChatCompletionResponse response = this.chatGptClientService.getRecipeRecommendations(aiRecipeRecommendationRequest);
        return deserializeChatResponse(response, AIRecipeRecommendationResult.class);
    }



    /**
     * Updates an existing recipe with the given details.
     *
     * @param recipeId the ID of the recipe to be updated
     * @param updateRecipeDto the data transfer object containing updated recipe details
     * @param updatedByEmail the email of the user performing the update
     * @return true if the recipe was successfully updated, otherwise throws an exception
     * @throws EntityToBeUpdatedNotFoundException if no recipe is found with the specified ID
     *         and user email, or if the recipe does not belong to the user
     */
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

    /**
     * Updates the categories associated with a recipe by comparing the current set of categories
     * with a new set of category IDs. This method removes categories that are no longer associated
     * and adds new categories that need to be linked to the recipe.
     *
     * @param categories       The current set of Category objects associated with the recipe.
     * @param categoryIds      The new set of category IDs to be associated with the recipe.
     * @param recipeId         The unique identifier of the recipe being updated.
     * @param updatedByEmail   The email of the user performing the update operation.
     */
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

    /**
     * Saves a recipe for a user identified by their email. If the user has already
     * saved the recipe, the method does nothing. Otherwise, it creates a new
     * saved recipe entry and persists it to the repository.
     *
     * @param recipeId the ID of the recipe to be saved
     * @param userEmail the email of the user who is saving the recipe
     */
    public void saveRecipeForUser(Integer recipeId, String userEmail) {

        SavedRecipe savedRecipe = this.savedRecipeRepository.findOneByRecipeAndCreatedBy(recipeId, userEmail).orElse(null);

        if(savedRecipe == null) {
            SavedRecipe newSavedRecipe = new SavedRecipe();
            newSavedRecipe.setCreatedBy(userEmail);
            newSavedRecipe.setCreatedAt(Instant.now());
            newSavedRecipe.setRecipe(recipeId);
            this.savedRecipeRepository.save(newSavedRecipe);
        }
    }

    /**
     * Removes a saved recipe for a specific user.
     *
     * @param recipeId the ID of the recipe to be removed
     * @param userEmail the email of the user who saved the recipe
     */
    public void removeSavedRecipe(Integer recipeId, String userEmail) {

        SavedRecipe savedRecipe = this.savedRecipeRepository.findOneByRecipeAndCreatedBy(recipeId, userEmail).orElse(null);

        if(savedRecipe != null) {
            this.savedRecipeRepository.delete(savedRecipe);
        }
    }

    /**
     * Retrieves a paginated list of saved recipe summaries for a specific user.
     *
     * @param page the page number to retrieve, 0-indexed
     * @param size the number of items per page
     * @param userEmail the email address of the user whose saved recipes are to be fetched
     * @return a page containing the list of recipe summaries for the specified user
     */
    public Page<RecipeSummaryForCards> getSavedRecipeForUser(Integer page, Integer size, String userEmail) {
        Pageable pageRequest = PageRequest.of(page, size);
        return this.recipeRepository.findSavedRecipeSummaryCardsByUser(userEmail, pageRequest);
    }
}
