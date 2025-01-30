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
}
