package org.group2.comp313.kitchen_companion.service;

import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotNull;
import org.group2.comp313.kitchen_companion.domain.Recipe;
import org.group2.comp313.kitchen_companion.domain.RecipeCategory;
import org.group2.comp313.kitchen_companion.domain.RecipeCategoryId;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeDTO;
import org.group2.comp313.kitchen_companion.repository.RecipeCategoryRepository;
import org.group2.comp313.kitchen_companion.repository.RecipeRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class RecipeService extends BaseService {

    private final RecipeRepository recipeRepository;
    private final StaticCodeService staticCodeService;
    private final IngredientGroupService ingredientGroupService;
    private final StepGroupService stepGroupService;

    // TODO: Moved into into its own service
    private final RecipeCategoryRepository recipeCategoryRepository;

    public RecipeService(RecipeRepository recipeRepository, StaticCodeService staticCodeService, IngredientGroupService ingredientGroupService, StepGroupService stepGroupService, RecipeCategoryRepository recipeCategoryRepository) {
        this.recipeRepository = recipeRepository;
        this.staticCodeService = staticCodeService;
        this.ingredientGroupService = ingredientGroupService;
        this.stepGroupService = stepGroupService;
        this.recipeCategoryRepository = recipeCategoryRepository;
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
                RecipeCategoryId recipeCategoryId = new RecipeCategoryId();
                recipeCategoryId.setCategoryId(categoryId);
                recipeCategoryId.setRecipeId(newRecipe.getId());

                RecipeCategory newRecipeCategory = new RecipeCategory();
                newRecipeCategory.setId(recipeCategoryId);
                newRecipeCategory.setCreatedBy(createdByEmail);
                newRecipeCategory.setCreatedAt(Instant.now());
                newRecipeCategory.setUpdatedBy(null);
                newRecipeCategory.setUpdatedAt(null);
                this.recipeCategoryRepository.save(newRecipeCategory);
            }

            this.ingredientGroupService.createIngredientGroups(dto.ingredientGroups(), newRecipe.getId(), createdByEmail);
            this.stepGroupService.createStepGroup(dto.stepGroups(), newRecipe.getId(), createdByEmail);

            return newRecipe;

        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
            return null;
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
