package org.group2.comp313.kitchen_companion.service;

import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotNull;
import org.group2.comp313.kitchen_companion.domain.Recipe;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeDTO;
import org.group2.comp313.kitchen_companion.repository.RecipeRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;

@Service
public class RecipeService extends BaseService {

    private final RecipeRepository recipeRepository;
    private final StaticCodeService staticCodeService;
    public RecipeService(RecipeRepository recipeRepository, StaticCodeService staticCodeService) {
        this.recipeRepository = recipeRepository;
        this.staticCodeService = staticCodeService;
    }

    @Transactional
    public Recipe createRecipe(RecipeDTO dto, @NotNull String createdByEmail) {
        try {
            Recipe newRecipe = mapDtoToRecipe(dto);
            newRecipe.setCreatedBy(createdByEmail);
            newRecipe.setCreatedAt(Instant.now());
            newRecipe.setUpdatedBy(null);
            newRecipe.setUpdatedAt(null);
            return newRecipe;
        } catch (Exception ex) {
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
        newRecipe.setCookTimeUnitCd(this.staticCodeService.getCodeValueUsingCodeValueId(dto.cookTimeUnitCd()).get());
        newRecipe.setPrepTimeUnitCd(this.staticCodeService.getCodeValueUsingCodeValueId(dto.prepTimeUnitCd()).get());
        return newRecipe;
    }
}
