package org.group2.comp313.kitchen_companion.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.group2.comp313.kitchen_companion.domain.CodeBook;
import org.group2.comp313.kitchen_companion.domain.Recipe;
import org.group2.comp313.kitchen_companion.domain.projection.RecipeSummaryForCards;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeCardsDto;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeDTO;
import org.group2.comp313.kitchen_companion.service.RecipeService;
import org.group2.comp313.kitchen_companion.service.StaticCodeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recipe")
@SecurityRequirement(name = "Keycloak")
@Tag(name = "Recipe API")
public class RecipeController extends BaseController {

    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @GetMapping("{id}")
    public ResponseEntity<Recipe> getRecipe(@PathVariable Integer id) {
        Recipe r = this.recipeService.getRecipeById(id);
        return new ResponseEntity<>(r, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<Page<RecipeSummaryForCards>> getAllRecipes(@RequestParam Integer page, @RequestParam Integer size) {
        return ResponseEntity.ok(this.recipeService.getRecipes(page, size));
    }

    @PostMapping
    public ResponseEntity<Void> createRecipe( @RequestBody @Valid() RecipeDTO createRecipeDto) {
        this.log.info("Request to create recipe: {}", createRecipeDto.toString());
        this.recipeService.createRecipe(createRecipeDto, "sysadmin@gmail.com");
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
