package org.group2.comp313.kitchen_companion.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.group2.comp313.kitchen_companion.domain.CodeBook;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeDTO;
import org.group2.comp313.kitchen_companion.service.RecipeService;
import org.group2.comp313.kitchen_companion.service.StaticCodeService;
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

    @PostMapping
    public ResponseEntity<Void> createRecipe( @RequestBody @Valid() RecipeDTO createRecipeDto) {
        this.log.info("Request to create recipe: " + createRecipeDto.toString());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
