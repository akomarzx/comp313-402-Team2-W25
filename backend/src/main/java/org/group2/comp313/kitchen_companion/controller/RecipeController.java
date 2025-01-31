package org.group2.comp313.kitchen_companion.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.group2.comp313.kitchen_companion.domain.Recipe;
import org.group2.comp313.kitchen_companion.domain.projection.RecipeSummaryForCards;
import org.group2.comp313.kitchen_companion.dto.ai.AIRecipeRecommendationResult;
import org.group2.comp313.kitchen_companion.dto.ai.AIRecipeRecommendationRequest;
import org.group2.comp313.kitchen_companion.dto.ApiResult;
import org.group2.comp313.kitchen_companion.dto.recipe.RecipeDTO;
import org.group2.comp313.kitchen_companion.service.AWSS3Service;
import org.group2.comp313.kitchen_companion.service.RecipeService;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/recipe")
@SecurityRequirement(name = "Keycloak")
@Tag(name = "Recipe API")
public class RecipeController extends BaseController {

    private final RecipeService recipeService;
    private final AWSS3Service awss3Service;

    //@Autowired
    //private final CsvImportService csvImportService;

    public RecipeController(RecipeService recipeService, AWSS3Service awss3Service) {
        this.recipeService = recipeService;
        this.awss3Service = awss3Service;
    }

    @GetMapping("{id}")
    public ResponseEntity<ApiResult<Recipe>> getRecipe(@PathVariable Integer id) {

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

    @GetMapping
    public ResponseEntity<ApiResult<Page<RecipeSummaryForCards>>>getAllRecipes(@RequestParam Integer page, @RequestParam Integer size) {
        try {
            return ResponseEntity.ok(new ApiResult<>("" ,this.recipeService.getRecipes(page, size)));
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResult<>(e.getLocalizedMessage(), null), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<Recipe> createRecipe(@RequestBody @Valid() RecipeDTO createRecipeDto,
                                              @AuthenticationPrincipal(expression = "claims['email']") String createdByEmail) {

        this.log.info("Request to create recipe: {}", createRecipeDto.toString());
        this.log.info("Request By {}", createdByEmail);

         Recipe newRecipe = this.recipeService.createRecipe(createRecipeDto, createdByEmail);
        return new ResponseEntity<Recipe>(newRecipe,HttpStatus.OK);
    }

    @PostMapping(path = "/upload", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public String uploadFile(@RequestParam("file") MultipartFile file) {
        return awss3Service.uploadFile(file.getOriginalFilename(), file);
    }

    @PostMapping("/ai-recipe-recommend")
    public ResponseEntity<ApiResult<AIRecipeRecommendationResult>> getAIRecipeRecommendation(@RequestBody @Valid() @NotNull AIRecipeRecommendationRequest request) {

        log.debug("Request to get ai recipe recommendation: {}", request);
        try {
            AIRecipeRecommendationResult result = this.recipeService.getAiRecipeRecommendation(request);
            return new ResponseEntity<>(new ApiResult<>("Successful Generation.", result), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResult<>(e.getLocalizedMessage(), null), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

//    @PostMapping("/etl")
//    public ResponseEntity<String> recipeEtl() {
//        log.info("Request to etl recipe");
//        this.csvImportService.importCsv();
//        return ResponseEntity.ok("job Started!");
//    }
}
