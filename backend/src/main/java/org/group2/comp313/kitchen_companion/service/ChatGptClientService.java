package org.group2.comp313.kitchen_companion.service;

import org.group2.comp313.kitchen_companion.domain.Category;
import org.group2.comp313.kitchen_companion.domain.CodeBook;
import org.group2.comp313.kitchen_companion.domain.CodeValue;
import org.group2.comp313.kitchen_companion.dto.ai.ChatCompletionRequest;
import org.group2.comp313.kitchen_companion.dto.ai.ChatCompletionResponse;
import org.group2.comp313.kitchen_companion.dto.ai.AIRecipeRecommendationRequest;
import org.group2.comp313.kitchen_companion.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Optional;

@Service
public class ChatGptClientService extends BaseService{

    private final String COMMA_DELIMITER = ", ";
    private final String NEW_LINE = "\n";

    private final WebClient restClient;
    private final CategoryRepository categoryRepository;
    private final StaticCodeService staticCodeService;

    @Value("${openapi.chatgpt.api-model}")
    private String openApiModel;

    public ChatGptClientService(@Value("${openapi.chatgpt.api-key}") String apiKey, CategoryRepository categoryRepository, StaticCodeService staticCodeService) {

        this.restClient = WebClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Accept", "application/json")
                .build();

        this.categoryRepository = categoryRepository;
        this.staticCodeService = staticCodeService;
    }

    public ChatCompletionResponse getRecipeRecommendations(AIRecipeRecommendationRequest recipeRecommendationRequest) {

        String recipeRecommendationPrompt = this.buildRecipeRecommendationPrompt(recipeRecommendationRequest);

        ChatCompletionRequest.Message prompt = new ChatCompletionRequest.Message("user", recipeRecommendationPrompt);
        ChatCompletionRequest chatCompletionRequest = new ChatCompletionRequest(openApiModel, List.of(prompt));

        try {
            ResponseEntity<ChatCompletionResponse> response = this.restClient.post()
                    .uri("/chat/completions")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(chatCompletionRequest)
                    .retrieve()
                    .toEntity(ChatCompletionResponse.class)
                    .block();

            assert response != null;
            return response.getBody();

        } catch (Exception e) {
            log.error(e.getMessage());
            throw e;
        }

    }

    private String buildRecipeRecommendationPrompt(AIRecipeRecommendationRequest recipeRecommendationRequest) {

        StringBuilder stringBuilder = new StringBuilder();

        stringBuilder.append("Please create a JSON recipe based on the following schema:");
        stringBuilder.append(NEW_LINE);
        stringBuilder.append(getRecipeDtoJsonAsString());
        stringBuilder.append(NEW_LINE);
        stringBuilder.append(createInstruction("Base the recipe on the following ingredients:", recipeRecommendationRequest.ingredientList(), COMMA_DELIMITER));
        stringBuilder.append(NEW_LINE);
        stringBuilder.append(createInstruction("Please tailor the recipe to the following dietary preferences if any:", recipeRecommendationRequest.mealPreferences(), COMMA_DELIMITER));
        stringBuilder.append(NEW_LINE);
        stringBuilder.append(createInstruction("Here are some allergies and dietary restrictions if any:", recipeRecommendationRequest.allergiesAndRestrictions(), COMMA_DELIMITER));
        stringBuilder.append(NEW_LINE);
        stringBuilder.append(createCategoryListString());
        stringBuilder.append(NEW_LINE);
        stringBuilder.append(createCodeValueListString("Also here are the only values for prepTimeUnitCD and cookTimeUnitCD", StaticCodeService.TIME_UNIT_CODE_BOOK_ID));
        stringBuilder.append(NEW_LINE);
        stringBuilder.append(createInstruction("For the Recipe Image URL please select randomly from the following list: ", List.of(
                "https://ronaldjro.dev/static/img/image1.jpg",
                "https://ronaldjro.dev/static/img/image2.jpg",
                "https://ronaldjro.dev/static/img/image3.jpg",
                "https://ronaldjro.dev/static/img/image4.jpg",
                "https://ronaldjro.dev/static/img/image5.jpg",
                "https://ronaldjro.dev/static/img/image6.jpg",
                "https://ronaldjro.dev/static/img/image7.jpg",
                "https://ronaldjro.dev/static/img/image8.jpg",
                "https://ronaldjro.dev/static/img/image9.jpg",
                "https://ronaldjro.dev/static/img/image10.jpg"
        ), NEW_LINE));
        stringBuilder.append(NEW_LINE);
        stringBuilder.append(createInstruction("Ensure the recipe is complete with: ", List.of(
                "A meaningful title and summary.",
                "Calories and nutritional information filled with realistic values.",
                "Step-by-step instructions grouped logically.",
                "Ingredient groups clearly labeled."
        ), NEW_LINE));
        stringBuilder.append(NEW_LINE);
        stringBuilder.append(NEW_LINE);
        stringBuilder.append("If the ingredient that the user provided were nonsense please set success to false and return the reason why the recipe generation failed");
        stringBuilder.append(NEW_LINE);
        stringBuilder.append("Also Please return a false success if the ingredients list has items from dietary and allergy list and state the reason why the recipe generation failed.");
        stringBuilder.append(NEW_LINE);
        stringBuilder.append("As this is used in an api call please don't include any explanation or any other text just the JSON result. If you include anything the system will break so please don't Thank you.");
        stringBuilder.append(NEW_LINE);
        stringBuilder.append("Can you also please make sure that the JSON result can be deserialized I am getting error with ObjectMapper Thanks.");

        this.log.debug(stringBuilder.toString());

        return stringBuilder.toString();

    }

    private String getRecipeDtoJsonAsString() {
        return "{\n  \"success\": true,\n  \"reasonForFail\": \"string\",\n  \"recipe\": {\n    \"title\": \"string\",\n    \"summary\": \"string\",\n    \"prepTime\": 1073741824,\n    \"prepTimeUnitCd\": 1073741824,\n    \"cookTime\": 1073741824,\n    \"cookTimeUnitCd\": 1073741824,\n    \"servings\": 1073741824,\n    \"yield\": \"string\",\n    \"imageUrl\": \"string\",\n    \"thumbnailUrl\": \"string\",\n    \"calories\": 0,\n    \"carbsG\": 0,\n    \"sugarsG\": 0,\n    \"fatG\": 0,\n    \"categoryIds\": [0],\n    \"ingredientGroups\": [\n      {\n        \"ingredientGroupOrder\": 1073741824,\n        \"label\": \"string\",\n        \"ingredients\": [\n          {\n            \"ingredientOrder\": 1073741824,\n            \"imageUrl\": \"string\",\n            \"label\": \"string\"\n          }\n        ]\n      }\n    ],\n    \"stepGroups\": [\n      {\n        \"stepGroupOrder\": 1073741824,\n        \"label\": \"string\",\n        \"steps\": [\n          {\n            \"stepOrder\": 1073741824,\n            \"label\": \"string\",\n            \"imageUrl\": \"string\"\n          }\n        ]\n      }\n    ]\n  }\n}";
        //return "{\n  \"success\": true,\n  \"recipe\": {\n    \"title\": \"string\",\n    \"summary\": \"string\",\n    \"prepTime\": 1073741824,\n    \"prepTimeUnitCd\": 1073741824,\n    \"cookTime\": 1073741824,\n    \"cookTimeUnitCd\": 1073741824,\n    \"servings\": 1073741824,\n    \"yield\": \"string\",\n    \"imageUrl\": \"string\",\n    \"thumbnailUrl\": \"string\",\n    \"calories\": 0,\n    \"carbsG\": 0,\n    \"sugarsG\": 0,\n    \"fatG\": 0,\n    \"categoryIds\": [0],\n    \"ingredientGroups\": [\n      {\n        \"ingredientGroupOrder\": 1073741824,\n        \"label\": \"string\",\n        \"ingredients\": [\n          {\n            \"ingredientOrder\": 1073741824,\n            \"imageUrl\": \"string\",\n            \"label\": \"string\"\n          }\n        ]\n      }\n    ],\n    \"stepGroups\": [\n      {\n        \"stepGroupOrder\": 1073741824,\n        \"label\": \"string\",\n        \"steps\": [\n          {\n            \"stepOrder\": 1073741824,\n            \"label\": \"string\",\n            \"imageUrl\": \"string\"\n          }\n        ]\n      }\n    ]\n  }\n}"
        //return "\"{\\n  \\\"title\\\": \\\"string\\\",\\n  \\\"summary\\\": \\\"string\\\",\\n  \\\"prepTime\\\": 1073741824,\\n  \\\"prepTimeUnitCd\\\": 1073741824,\\n  \\\"cookTime\\\": 1073741824,\\n  \\\"cookTimeUnitCd\\\": 1073741824,\\n  \\\"servings\\\": 1073741824,\\n  \\\"yield\\\": \\\"string\\\",\\n  \\\"imageUrl\\\": \\\"string\\\",\\n  \\\"thumbnailUrl\\\": \\\"string\\\",\\n  \\\"calories\\\": 0,\\n  \\\"carbsG\\\": 0,\\n  \\\"sugarsG\\\": 0,\\n  \\\"fatG\\\": 0,\\n  \\\"categoryIds\\\": [\\\"categoryId\\\"],\\n  \\\"ingredientGroups\\\": [\\n    {\\n      \\\"ingredientGroupOrder\\\": 1073741824,\\n      \\\"label\\\": \\\"string\\\",\\n      \\\"ingredients\\\": [\\n        {\\n          \\\"ingredientOrder\\\": 1073741824,\\n          \\\"imageUrl\\\": \\\"string\\\",\\n          \\\"label\\\": \\\"string\\\"\\n        }\\n      ]\\n    }\\n  ],\\n  \\\"stepGroups\\\": [\\n    {\\n      \\\"stepGroupOrder\\\": 1073741824,\\n      \\\"label\\\": \\\"string\\\",\\n      \\\"steps\\\": [\\n        {\\n          \\\"stepOrder\\\": 1073741824,\\n          \\\"label\\\": \\\"string\\\",\\n          \\\"imageUrl\\\": \\\"string\\\"\\n        }\\n      ]\\n    }\\n  ]\\n}\"\n";
    }

    private String createInstruction(String leadingPrompt, List<String> items, String separator) {
        StringBuilder stringBuilder = new StringBuilder();

        stringBuilder.append(leadingPrompt);
        stringBuilder.append(NEW_LINE);

        if(items != null && !items.isEmpty()) {
            for(int i = 0; i < items.size(); i++) {
                stringBuilder.append(items.get(i));
                if(i < items.size() - 1) {
                    stringBuilder.append(separator);
                }
            }
        }

        return stringBuilder.toString();
    }

    private String createCategoryListString() {

        StringBuilder stringBuilder = new StringBuilder();

        stringBuilder.append("Here are the categoryIds and category available:");
        stringBuilder.append(NEW_LINE);

        List<Category> categories = this.categoryRepository.findAll();

        for(Category category : categories) {
            stringBuilder.append(category.toString());
            stringBuilder.append(NEW_LINE);
        }

        return stringBuilder.toString();
    }

    private String createCodeValueListString(String leadingPrompt, Integer codeBookId) {

        StringBuilder stringBuilder = new StringBuilder();

        Optional<CodeBook> codeBook = this.staticCodeService.getCodeValueListUsingCodeBookID(codeBookId);

        if(codeBook.isPresent()) {
            stringBuilder.append(leadingPrompt);
            stringBuilder.append(NEW_LINE);

            for(CodeValue codeValue : codeBook.get().getCodeValues()) {
                stringBuilder.append(codeValue.toString());
                stringBuilder.append(NEW_LINE);
            }
        }

        return stringBuilder.toString();
    }
}
