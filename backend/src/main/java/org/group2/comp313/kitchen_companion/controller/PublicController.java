package org.group2.comp313.kitchen_companion.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.group2.comp313.kitchen_companion.domain.Recipe;
import org.group2.comp313.kitchen_companion.dto.ApiResult;
import org.group2.comp313.kitchen_companion.dto.rating.RecipeRatingDto;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeSummaryCardWithCategory;
import org.group2.comp313.kitchen_companion.service.RatingsService;
import org.group2.comp313.kitchen_companion.service.RecipeService;
import org.springframework.dao.InvalidDataAccessResourceUsageException;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/public")
@Tag(name = "Public API", description = "All Public APIs available")
public class PublicController extends BaseController {

    private final RecipeService recipeService;
    private final RatingsService ratingsService;

    public PublicController(RecipeService recipeService, RatingsService ratingsService) {
        this.recipeService = recipeService;
        this.ratingsService = ratingsService;
    }

    @GetMapping("/recipe/{id}")
    public ResponseEntity<ApiResult<Recipe>> getRecipe(@PathVariable Integer id,
                                                       @AuthenticationPrincipal Jwt jwt) {

        log.info("Get recipe with id {}", id);

        String email = null;

        if(jwt != null) {
            email = jwt.getClaimAsString("email");
        }

        ApiResult<Recipe> apiResult;
        HttpStatus status;

        try {

            Recipe recipe = this.recipeService.getRecipeById(id, email);

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
    public ResponseEntity<ApiResult<Page<RecipeSummaryCardWithCategory>>> getRecipes(@RequestParam(required = false) String search,
                                                                          @RequestParam(defaultValue = "0") Integer page,
                                                                          @RequestParam(defaultValue = "10") Integer size,
                                                                          @RequestParam(required = false) String[] sort, @AuthenticationPrincipal Jwt jwt) {

        log.debug("Request to retrieve all recipe");

        String email = null;

        if(jwt != null) {
            email = jwt.getClaimAsString("email");
        }

        try {
            return ResponseEntity.ok(new ApiResult<>("", recipeService.getRecipes(search, page, size, sort, email)));
        } catch (InvalidDataAccessResourceUsageException exception) {
                return new ResponseEntity<>(new ApiResult<>("Sort Criteria might be invalid please verify", null), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResult<>(e.getLocalizedMessage(), null), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/rating/recipe/{recipeId}")
    public ResponseEntity<ApiResult<RecipeRatingDto>> getRatingForUser(@PathVariable(name = "recipeId") Integer recipeId) {
        try {

            RecipeRatingDto result = this.ratingsService.getRecipeRatingForUser(recipeId, null);

            if (result != null) {
                return new ResponseEntity<>(new ApiResult<>(null, result), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ApiResult<>("Failed to retrieve user rating for this recipe. ", null), HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            this.log.error(e.getMessage());
            return new ResponseEntity<>(new ApiResult<>("Failed to retrieve user rating for this recipe. ", null), HttpStatus.BAD_REQUEST);
        }
    }

}
