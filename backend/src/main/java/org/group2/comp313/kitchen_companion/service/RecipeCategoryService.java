package org.group2.comp313.kitchen_companion.service;

import org.group2.comp313.kitchen_companion.domain.RecipeCategory;
import org.group2.comp313.kitchen_companion.domain.RecipeCategoryId;
import org.group2.comp313.kitchen_companion.repository.RecipeCategoryRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class RecipeCategoryService {

    private final RecipeCategoryRepository recipeCategoryRepository;

    public RecipeCategoryService(RecipeCategoryRepository recipeCategoryRepository) {
        this.recipeCategoryRepository = recipeCategoryRepository;
    }

    /**
     * Creates a new recipe category by associating a category with a recipe.
     * This method generates a composite identifier for the association,
     * assigns creation metadata, and saves the new recipe category entity
     * in the repository.
     *
     * @param categoryId the ID of the category to associate with the recipe
     * @param recipeId the ID of the recipe to associate with the category
     * @param createdByEmail the email of the user who is creating the recipe category
     */
    public void createRecipeCategory(Integer categoryId, Integer recipeId, String createdByEmail) {

        RecipeCategoryId recipeCategoryId = new RecipeCategoryId();
        recipeCategoryId.setCategoryId(categoryId);
        recipeCategoryId.setRecipeId(recipeId);

        RecipeCategory newRecipeCategory = new RecipeCategory();
        newRecipeCategory.setId(recipeCategoryId);
        newRecipeCategory.setCreatedBy(createdByEmail);
        newRecipeCategory.setCreatedAt(Instant.now());
        newRecipeCategory.setUpdatedBy(null);
        newRecipeCategory.setUpdatedAt(null);
        this.recipeCategoryRepository.save(newRecipeCategory);
    }

    /**
     * Deletes the association between a recipe and a category. This method uses
     * the composite identifier, consisting of the recipe and category IDs, to
     * locate and remove the corresponding entry from the repository.
     *
     * @param categoryId the ID of the category to be disassociated from the recipe
     * @param recipeId the ID of the recipe to be disassociated from the category
     */
    public void deleteRecipeCategory(Integer categoryId, Integer recipeId) {
        RecipeCategoryId recipeCategoryId = new RecipeCategoryId();
        recipeCategoryId.setCategoryId(categoryId);
        recipeCategoryId.setRecipeId(recipeId);
        this.recipeCategoryRepository.deleteById(recipeCategoryId);
    }
}
