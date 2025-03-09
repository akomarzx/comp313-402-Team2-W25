package org.group2.comp313.kitchen_companion.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.apache.camel.ProducerTemplate;
import org.apache.camel.support.DefaultExchange;
import org.group2.comp313.kitchen_companion.domain.Recipe;
import org.group2.comp313.kitchen_companion.domain.UserInteraction;
import org.group2.comp313.kitchen_companion.dto.ApiResult;
import org.group2.comp313.kitchen_companion.dto.UserInteractionDto;
import org.group2.comp313.kitchen_companion.dto.rating.RecipeRatingDto;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeSummaryCardWithCategory;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeSummaryForCards;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeSummaryForCardsWithScore;
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
    private final ProducerTemplate producerTemplate;

    public PublicController(RecipeService recipeService, RatingsService ratingsService, ProducerTemplate producerTemplate) {
        this.recipeService = recipeService;
        this.ratingsService = ratingsService;
        this.producerTemplate = producerTemplate;
    }

    @GetMapping("/recipe/{id}")
    public ResponseEntity<ApiResult<Recipe>> getRecipe(@PathVariable Integer id,
                                                       @AuthenticationPrincipal Jwt jwt,
                                                       @RequestHeader(value = "Session-Id", required = false) String sessionId) {

        log.info("Get recipe with id {}", id);

        String email = "";

        if(sessionId != null) {
            UserInteractionDto userInteractionDto = new UserInteractionDto(sessionId, id, "view");
            this.producerTemplate.asyncSendBody("direct:userInteractionEvents", userInteractionDto);
        }

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
                                                                                     @RequestParam(required = false) String category,
                                                                                     @RequestParam(defaultValue = "0") Integer page,
                                                                                     @RequestParam(defaultValue = "10") Integer size,
                                                                                     @RequestParam(required = false) String[] sort, @AuthenticationPrincipal Jwt jwt) {

        log.debug("Request to retrieve all recipe");

        String email = "";

        if(jwt != null) {
            email = jwt.getClaimAsString("email");
        }

        try {
            return ResponseEntity.ok(new ApiResult<>("", recipeService.getRecipes(search, category, page, size, sort, email)));
        } catch (InvalidDataAccessResourceUsageException exception) {
                return new ResponseEntity<>(new ApiResult<>("Sort Criteria might be invalid please verify", null), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResult<>(e.getLocalizedMessage(), null), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/top-recipe")
    public ResponseEntity<ApiResult<List<RecipeSummaryForCardsWithScore>>> getTop10RecipeBasedOnUserInteraction() {

        try {
            return ResponseEntity.ok(new ApiResult<>("", recipeService.getTop10RecommendedRecipes()));
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
