package org.group2.comp313.kitchen_companion.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.group2.comp313.kitchen_companion.domain.Recipe;
import org.group2.comp313.kitchen_companion.dto.ApiResult;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeSummaryCardWithCategory;
import org.group2.comp313.kitchen_companion.service.AWSS3Service;
import org.group2.comp313.kitchen_companion.service.RecipeService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/public")
@Tag(name = "Public API", description = "All Public APIs available")
public class PublicController extends BaseController {

    private final RecipeService recipeService;

    public PublicController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @GetMapping("/recipe/{id}")
    public ResponseEntity<ApiResult<Recipe>> getRecipe(@PathVariable Integer id) {

        log.info("Get recipe with id {}", id);

        ApiResult<Recipe> apiResult;
        HttpStatus status;

        try {

            Recipe recipe = this.recipeService.getRecipeById(id);

            if(recipe == null) {
                status = HttpStatus.NOT_FOUND;
                apiResult = new ApiResult<>("Recipe not found.", null);
            } else {
                status = HttpStatus.OK;
                apiResult = new ApiResult<>("", recipe);
            }

            return new ResponseEntity<>(apiResult, status);

        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResult<>(e.getLocalizedMessage(), null), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/recipe")
    public ResponseEntity<ApiResult<Page<RecipeSummaryCardWithCategory>>>getAllRecipes(@RequestParam Integer page, @RequestParam Integer size) {

        log.debug("Request to retrieve all recipe");

        try {
            return ResponseEntity.ok(new ApiResult<>("" ,this.recipeService.getRecipes(page, size)));
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResult<>(e.getLocalizedMessage(), null), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
