package org.group2.comp313.kitchen_companion.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.group2.comp313.kitchen_companion.dto.ApiResult;
import org.group2.comp313.kitchen_companion.dto.rating.PostRatingDto;
import org.group2.comp313.kitchen_companion.dto.rating.RecipeRatingDto;
import org.group2.comp313.kitchen_companion.service.RatingsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rating")
@SecurityRequirement(name = "Keycloak")
@Tag(name = "Rating API")
public class RatingController extends BaseController {

    private final RatingsService ratingsService;

    public RatingController(RatingsService ratingsService) {
        this.ratingsService = ratingsService;
    }

    @PutMapping("/{recipeId}")
    public ResponseEntity<ApiResult<RecipeRatingDto>> upsertRatingForRecipeForUser(@PathVariable(name = "recipeId") Integer recipeId,
                                                                                   @Valid @RequestBody PostRatingDto ratingDto,
                                                                                   @AuthenticationPrincipal(expression = "claims['email']") String userEmail) {

        try {
            RecipeRatingDto recipeRatingDto = this.ratingsService.upsertRatingForUser(ratingDto, recipeId, userEmail);
            return new ResponseEntity<>(new ApiResult<>("Recipe was successfully rated", recipeRatingDto), HttpStatus.OK);
        } catch (Exception e) {
            this.log.error(e.getMessage());
            return new ResponseEntity<>(new ApiResult<>("Failed to add rating to the recipe", null), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{ratingId}")
    public ResponseEntity<ApiResult<Boolean>> deleteRating(@PathVariable(name = "ratingId") Integer ratingId,
                                                           @AuthenticationPrincipal(expression = "claims['email']") String userEmail) {
        try {
            Boolean result = this.ratingsService.removeRatingForUser(ratingId, userEmail);
            if (result) {
                return new ResponseEntity<>(new ApiResult<>("Rating was successfully deleted", true), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ApiResult<>("Failed to delete rating " + ratingId, null), HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            this.log.error(e.getMessage());
            return new ResponseEntity<>(new ApiResult<>("Failed to delete rating " + ratingId, null), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/my-rating/recipe/{recipeId}")
    public ResponseEntity<ApiResult<RecipeRatingDto>> getRatingForUser(@PathVariable(name = "recipeId") Integer recipeId,
                                                                       @AuthenticationPrincipal(expression = "claims['email']") String userEmail) {
        try {
            RecipeRatingDto result = this.ratingsService.getRecipeRatingForUser(recipeId, userEmail);
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
