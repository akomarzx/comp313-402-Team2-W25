package org.group2.comp313.kitchen_companion.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RecipeCsvRow {
    private String name;
    private String url;
    private String category;
    private String author;
    private String summary;
    private double rating;

    @JsonProperty("rating_count")
    private int ratingCount;

    @JsonProperty("review_count")
    private int reviewCount;

    private String ingredients;
    private String directions;
    private String prep;
    private String cook;
    private String total;
    private int servings;
    private String yield;

    private BigDecimal calories;

    @JsonProperty("carbohydrate_g")
    private BigDecimal carbohydratesG;
    @JsonProperty("sugar_g")
    private BigDecimal sugarsG;
    @JsonProperty("fat_g")
    private BigDecimal fatG;

    @JsonProperty("saturated_fat_g")
    private double saturatedFatG;

    @JsonProperty("cholesterol_mg")
    private double cholesterolMg;

    @JsonProperty("protein_g")
    private double proteinG;

    @JsonProperty("dietary_fiber_g")
    private double dietaryFiberG;

    @JsonProperty("sodium_mg")
    private double sodiumMg;

    @JsonProperty("calories_from_fat")
    private double caloriesFromFat;

    @JsonProperty("calcium_mg")
    private double calciumMg;

    @JsonProperty("iron_mg")
    private double ironMg;

    @JsonProperty("magnesium_mg")
    private double magnesiumMg;

    @JsonProperty("potassium_mg")
    private double potassiumMg;

    @JsonProperty("zinc_mg")
    private double zincMg;

    @JsonProperty("phosphorus_mg")
    private double phosphorusMg;

    @JsonProperty("vitamin_a_iu_IU")
    private double vitaminAIuIU;

    @JsonProperty("niacin_equivalents_mg")
    private double niacinEquivalentsMg;

    @JsonProperty("vitamin_b6_mg")
    private double vitaminB6Mg;

    @JsonProperty("vitamin_c_mg")
    private double vitaminCMg;

    @JsonProperty("folate_mcg")
    private double folateMcg;

    @JsonProperty("thiamin_mg")
    private double thiaminMg;

    @JsonProperty("riboflavin_mg")
    private double riboflavinMg;

    @JsonProperty("vitamin_e_iu_IU")
    private double vitaminEIuIU;

    @JsonProperty("vitamin_k_mcg")
    private double vitaminKMcg;

    @JsonProperty("biotin_mcg")
    private double biotinMcg;

    @JsonProperty("vitamin_b12_mcg")
    private double vitaminB12Mcg;

    @JsonProperty("mono_fat_g")
    private double monoFatG;

    @JsonProperty("poly_fat_g")
    private double polyFatG;

    @JsonProperty("trans_fatty_acid_g")
    private double transFattyAcidG;

    @JsonProperty("omega_3_fatty_acid_g")
    private double omega3FattyAcidG;

    @JsonProperty("omega_6_fatty_acid_g")
    private double omega6FattyAcidG;
}
