package org.group2.comp313.kitchen_companion.service;

//import com.fasterxml.jackson.dataformat.csv.CsvMapper;
//import com.fasterxml.jackson.dataformat.csv.CsvParser;
//import com.fasterxml.jackson.dataformat.csv.CsvSchema;
//import org.group2.comp313.kitchen_companion.domain.Category;
//import org.group2.comp313.kitchen_companion.domain.RecipeCsvRow;
//import org.group2.comp313.kitchen_companion.dto.recipe.*;
//import org.group2.comp313.kitchen_companion.repository.CategoryRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.core.io.ClassPathResource;
//import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
/**
 * Service responsible for importing recipes from a CSV file, parsing the data
 * into proper format, and saving it into the system's database. This service
 * utilizes data transformation, validation, and asynchronous processing to
 * handle large-scale imports.
 *
 * The CSV file is expected to adhere to a predefined schema with columns
 * such as name, category, ingredients, preparation time, and various
 * nutritional information fields. The imported data is mapped into domain
 * objects, such as recipes, categories, ingredients, and steps.
 *
 * Key responsibilities of the service include:
 * - Reading a CSV file from the classpath resource.
 * - Parsing the CSV data into structured Java objects.
 * - Creating new recipes, categories, and associated entities in the database.
 * - Deduplicating or normalizing categories to avoid redundancy.
 * - Asynchronous execution for long-running import tasks.
 */
//import java.io.*;
//import java.time.Instant;
//import java.util.*;
//import java.util.regex.Matcher;
//import java.util.regex.Pattern;
//import java.util.stream.Collectors;
//
@Service
public class CsvImportService extends BaseService{
//
//    @Autowired
//    private RecipeService recipeService;
//
//    @Autowired
//    private CategoryRepository categoryRepository;
//
//    private final Map<String, Integer> categoryCache = new HashMap<>();
//
//    private Integer extractTimeInMinutes(String timeString) {
//        if (timeString == null || timeString.isEmpty()) {
//            return 0;
//        }
//
//        Pattern pattern = Pattern.compile("^(\\d+)");
//        Matcher matcher = pattern.matcher(timeString.trim());
//
//        if (matcher.find()) {
//            return Integer.parseInt(matcher.group(1));
//        } else {
//            return 0; // Return null if no numeric value is found
//        }
//    }
//
//    @Async
//    public void importCsv() {
//
//        ClassPathResource resource = new ClassPathResource("recipes.csv");
//
//        try {
//
//            CsvMapper objectMapper = new CsvMapper();
//
//            CsvSchema csvSchema = CsvSchema.builder()
//                    .addColumn("name")
//                    .addColumn("url")
//                    .addColumn("category")
//                    .addColumn("author")
//                    .addColumn("summary")
//                    .addColumn("rating", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("rating_count", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("review_count", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("ingredients")
//                    .addColumn("directions")
//                    .addColumn("prep")
//                    .addColumn("cook")
//                    .addColumn("total")
//                    .addColumn("servings", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("yield")
//                    .addColumn("calories", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("carbohydrate_g", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("sugar_g", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("fat_g", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("saturated_fat_g", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("cholesterol_mg", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("protein_g", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("dietary_fiber_g", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("sodium_mg", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("calories_from_fat", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("calcium_mg", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("iron_mg", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("magnesium_mg", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("potassium_mg", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("zinc_mg", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("phosphorus_mg", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("vitamin_a_iu_IU", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("niacin_equivalents_mg", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("vitamin_b6_mg", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("vitamin_c_mg", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("folate_mcg", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("thiamin_mg", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("riboflavin_mg", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("vitamin_e_iu_IU", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("vitamin_k_mcg", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("biotin_mcg", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("vitamin_b12_mcg", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("mono_fat_g", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("poly_fat_g", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("trans_fatty_acid_g", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("omega_3_fatty_acid_g", CsvSchema.ColumnType.NUMBER)
//                    .addColumn("omega_6_fatty_acid_g", CsvSchema.ColumnType.NUMBER)
//                    .setSkipFirstDataRow(true)
//                    .setUseHeader(true)  // This indicates that the first line is a header
//                    .build();
//
//            List<RecipeCsvRow> recipes = objectMapper.readerForListOf(RecipeCsvRow.class)
//                    .with(CsvParser.Feature.WRAP_AS_ARRAY)
//                    .with(csvSchema)
//                    .readValue(resource.getInputStream());
//
//            int counter = 14904;
//
//            for (int i = counter ; i < recipes.size(); i++) {
//                RecipeDTO dto = mapCsvToDto(recipes.get(i), recipes.get(i).getAuthor());
//                this.recipeService.createRecipe(dto, recipes.get(i).getAuthor());
//                ++counter;
//                this.log.info("Created recipe: " + counter);
//            }
//
//        } catch (IOException e) {
//            log.error(e.getMessage(), e);
//            throw new RuntimeException("Error reading CSV file", e);
//        }
//    }
//
//    private RecipeDTO mapCsvToDto(RecipeCsvRow csvRow, String createdByEmail) {
//
//        Integer categoryId = getOrCreateCategory(csvRow.getCategory(), createdByEmail);
//
//        List<IngredientGroupDTO> ingredientGroups = List.of(new IngredientGroupDTO(
//                1,
//                "",
//                parseIngredients(csvRow.getIngredients())
//        ));
//
//        List<StepGroupDTO> stepGroups = List.of(new StepGroupDTO(
//                1,
//                "",
//                parseSteps(csvRow.getDirections())
//        ));
//
//        // Map RecipeDTO
//        return new RecipeDTO(
//                csvRow.getName(),
//                csvRow.getSummary().trim().isEmpty() ? "Nice Recipe!" : csvRow.getSummary().trim(),
//                extractTimeInMinutes(csvRow.getPrep()),
//                100,
//                extractTimeInMinutes(csvRow.getPrep()),
//                100,
//                csvRow.getServings(),
//                csvRow.getYield(),
//                "x",
//                "x",
//                csvRow.getCalories(),
//                csvRow.getCarbohydratesG(),
//                csvRow.getSugarsG(),
//                csvRow.getFatG(),
//                List.of(categoryId),
//                ingredientGroups,
//                stepGroups
//        );
//    }
//
//    private Integer getOrCreateCategory(String rawCategoryLabel, String createdByEmail) {
//        String cleanedLabel = normalizeCategory(rawCategoryLabel);
//
//        if (categoryCache.containsKey(cleanedLabel)) {
//            return categoryCache.get(cleanedLabel);
//        }
//
//        Category existingCategory = categoryRepository.findByLabel(cleanedLabel);
//        if (existingCategory != null) {
//            categoryCache.put(cleanedLabel, existingCategory.getId());
//            return existingCategory.getId();
//        }
//
//        Category newCategory = new Category();
//        newCategory.setLabel(cleanedLabel);
//        newCategory.setCreatedBy(createdByEmail);
//        newCategory.setCreatedAt(Instant.now());
//        categoryRepository.save(newCategory);
//
//        categoryCache.put(cleanedLabel, newCategory.getId());
//        return newCategory.getId();
//    }
//
//    private String normalizeCategory(String category) {
//        if (category == null || category.isEmpty()) {
//            return "Uncategorized";
//        }
//
//        // Replace special characters like hyphens and normalize "and" cases
//        String cleanedCategory = category
//                .replaceAll("-", " ")
//                .replaceAll("&", "and")
//                .replaceAll("\\s+", " ")
//                .trim();
//
//        // Capitalize each word for a UI-friendly label
//        return Arrays.stream(cleanedCategory.split(" "))
//                .map(word -> word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase())
//                .collect(Collectors.joining(" "));
//    }
//
//    private List<IngredientDTO> parseIngredients(String ingredients) {
//        String[] items = ingredients.split(";");
//        List<IngredientDTO> ingredientDTOs = new ArrayList<>();
//        int order = 1;
//
//        for (String item : items) {
//            ingredientDTOs.add(new IngredientDTO(order++, "y", item.trim()));
//        }
//        return ingredientDTOs;
//    }
//
//    private List<StepDTO> parseSteps(String directions) {
//        String[] steps = directions.split("\\.");
//        List<StepDTO> stepDTOs = new ArrayList<>();
//        int order = 1;
//
//        for (String step : steps) {
//            if (!step.isBlank()) {
//                stepDTOs.add(new StepDTO(order++, step.trim(), "Z"));
//            }
//        }
//        return stepDTOs;
//    }
}
