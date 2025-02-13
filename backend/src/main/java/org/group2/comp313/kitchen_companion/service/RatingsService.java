package org.group2.comp313.kitchen_companion.service;

import jakarta.transaction.Transactional;
import org.group2.comp313.kitchen_companion.domain.Rating;
import org.group2.comp313.kitchen_companion.domain.RatingCalculated;
import org.group2.comp313.kitchen_companion.domain.Recipe;
import org.group2.comp313.kitchen_companion.dto.rating.PostRatingDto;
import org.group2.comp313.kitchen_companion.dto.rating.RecipeRatingDto;
import org.group2.comp313.kitchen_companion.repository.RatingCalculatedRepository;
import org.group2.comp313.kitchen_companion.repository.RatingRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.Optional;

@Service
public class RatingsService extends BaseService {

    private final RatingRepository ratingRepository;
    private final RatingCalculatedRepository ratingCalculatedRepository;

    public RatingsService(RatingRepository ratingRepository, RatingCalculatedRepository ratingCalculatedRepository) {
        this.ratingRepository = ratingRepository;
        this.ratingCalculatedRepository = ratingCalculatedRepository;
    }

    /**
     * Retrieves the recipe rating details for a specific user given a recipe ID and username.
     * The details include the average rating for the recipe, the number of ratings,
     * the user's specific rating for the recipe (if available), and the user's rating ID (if available).
     *
     * @param recipeId The ID of the recipe for which the rating should be retrieved.
     * @param username The username of the user whose rating details are to be fetched.
     * @return A {@code RecipeRatingDto} object containing the recipe's average rating,
     *         the number of ratings, the user's individual rating (if they have rated),
     *         and the rating ID for the user (if applicable).
     */
    public RecipeRatingDto getRecipeRatingForUser(Integer recipeId, String username) {

        Optional<RatingCalculated> calculated = this.ratingCalculatedRepository.findById(recipeId);
        Optional<Rating> userRatingForRecipe = ratingRepository.findByRecipeAndCreatedBy(recipeId, username);

        BigDecimal userRating;
        Integer userRatingId;

        if (calculated.isPresent()) {
            BigDecimal calculatedRating = calculated.get().getRatingValue();
            Long getRatingCount = Long.valueOf(calculated.get().getRatingCount());
            if(userRatingForRecipe.isPresent()) {
                userRating = userRatingForRecipe.get().getRatingValue();
                userRatingId = userRatingForRecipe.get().getId();
            } else {
                userRating = null;
                userRatingId = null;
            }
            return new RecipeRatingDto(calculatedRating, getRatingCount, userRating, userRatingId);
        } else {
            return new RecipeRatingDto(new BigDecimal("0.0"), 0L, new BigDecimal("0.0"), null);
        }
    }

    /**
     * Updates or inserts a rating for a user on a given recipe. If the user has already rated the
     * specified recipe, their rating is updated. If no rating exists from the user for the recipe,
     * a new rating is created. The overall average rating and rating count for the recipe are also updated.
     *
     * @param postRatingDto The details of the rating provided by the user, including the rating value.
     * @param recipeId The ID of the recipe for which the rating is being provided.
     * @param username The username of the user submitting the rating.
     * @return A {@code RecipeRatingDto} object containing the updated average rating for the recipe,
     *         the total count of ratings for the recipe, the user's submitted rating value, and the ID of the user's rating.
     */
    @Transactional
    public RecipeRatingDto upsertRatingForUser(PostRatingDto postRatingDto, Integer recipeId, String username) {

        Optional<Rating> rating = ratingRepository.findOneByRecipeAndCreatedBy(recipeId, username);
        Rating userRating = null;

        if (rating.isPresent()) {
            rating.get().setRatingValue(postRatingDto.ratingValue());
            rating.get().setUpdatedAt(Instant.now());
            rating.get().setUpdatedBy(username);
            userRating = ratingRepository.save(rating.get());
        } else {
            Rating newRating = new Rating();
            newRating.setRatingValue(postRatingDto.ratingValue());
            newRating.setCreatedAt(Instant.now());
            newRating.setCreatedBy(username);
            newRating.setRecipe(recipeId);
            userRating = ratingRepository.save(newRating);
        }

        Long currentCount = ratingRepository.countByRecipe(recipeId);
        BigDecimal ratingValue = ratingRepository.getAverageRatingByRecipe(recipeId).setScale(1, RoundingMode.CEILING);

        Optional<RatingCalculated> calculated = ratingCalculatedRepository.findById(recipeId);

        if (calculated.isPresent()) {
            calculated.get().setRatingValue(ratingValue);
            calculated.get().setRatingCount(currentCount.intValue());
            ratingCalculatedRepository.save(calculated.get());
        } else {
            RatingCalculated newRatingCalculated = new RatingCalculated();
            newRatingCalculated.setRatingValue(ratingValue);
            newRatingCalculated.setRatingCount(currentCount.intValue());
            newRatingCalculated.setId(recipeId);
            ratingCalculatedRepository.save(newRatingCalculated);
        }

        return new RecipeRatingDto(ratingValue, currentCount, postRatingDto.ratingValue(), userRating.getId());

    }

    /**
     * Removes a rating for a given user if it exists.
     *
     * @param ratingId the ID of the rating to be removed
     * @param username the username of the user who created the rating
     * @return true if the rating was found and removed, false otherwise
     */
    public Boolean removeRatingForUser(Integer ratingId, String username) {
        Optional<Rating> rating = ratingRepository.findByIdAndCreatedBy(ratingId, username);
        rating.ifPresent(value -> this.ratingRepository.deleteById(value.getId()));
        return rating.isPresent();
    }
}
