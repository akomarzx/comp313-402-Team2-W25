package org.group2.comp313.kitchen_companion.service;

import jakarta.validation.Valid;
import org.group2.comp313.kitchen_companion.domain.CodeBook;
import org.group2.comp313.kitchen_companion.domain.UserInteraction;
import org.group2.comp313.kitchen_companion.dto.UserInteractionDto;
import org.group2.comp313.kitchen_companion.repository.UserInteractionRepository;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service
public class UserInteractionEventsService extends BaseService{

    private final UserInteractionRepository userInteractionRepository;
    private final StaticCodeService staticCodeService;

    private CodeBook userInteractionEventCodeBook;

    public UserInteractionEventsService(UserInteractionRepository userInteractionRepository, StaticCodeService staticCodeService) {
        this.userInteractionRepository = userInteractionRepository;
        this.staticCodeService = staticCodeService;
    }

    public void createUserInteractionEvent(@Valid UserInteractionDto userInteractionDto) {

        Integer codeValueId = this.getCodeValueIdForInteractionEvent(userInteractionDto.eventType());

        Optional<UserInteraction> existingInteraction = this.userInteractionRepository.findUserInteractionBySessionIdAndUserInteractionEventTypeCodeAndRecipe(userInteractionDto.sessionId(), codeValueId, userInteractionDto.recipeId());

        if (existingInteraction.isEmpty()) {
            UserInteraction userInteraction = new UserInteraction();
            userInteraction.setCreatedBy(null);
            userInteraction.setSessionId(userInteractionDto.sessionId());
            userInteraction.setRecipe(userInteractionDto.recipeId());
            userInteraction.setUserInteractionEventTypeCode(codeValueId);
            this.userInteractionRepository.save(userInteraction);
        }

    }

    public void clearUserInteractionEventTable() {
        this.userInteractionRepository.deleteAll();
    }

    private Integer getCodeValueIdForInteractionEvent(String event) {

        if(userInteractionEventCodeBook == null) {
            userInteractionEventCodeBook = this.staticCodeService.getCodeValueListUsingCodeBookID(StaticCodeService.USER_INTERACTION_EVENT_CODE_BOOK_ID).get();
        }

        return Objects.requireNonNull(userInteractionEventCodeBook.getCodeValues().stream().filter((value) -> value.getLabel().equals(event)).findFirst().orElse(null)).getId();
    }

}
