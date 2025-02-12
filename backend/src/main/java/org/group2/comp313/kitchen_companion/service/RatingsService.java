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
        BigDecimal ratingValue = ratingRepository.getAverageRatingByRecipe(recipeId);

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

    public Boolean removeRatingForUser(Integer ratingId, String username) {
        Optional<Rating> rating = ratingRepository.findByIdAndCreatedBy(ratingId, username);
        rating.ifPresent(value -> this.ratingRepository.deleteById(value.getId()));
        return rating.isPresent();
    }
}
