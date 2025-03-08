package org.group2.comp313.kitchen_companion.service;

import jakarta.transaction.Transactional;
import org.group2.comp313.kitchen_companion.domain.CodeBook;
import org.group2.comp313.kitchen_companion.domain.CodeValue;
import org.group2.comp313.kitchen_companion.repository.CodeBookRepository;
import org.group2.comp313.kitchen_companion.repository.CodeValueRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * Service for Static Code for the API
 */
@Service
public class StaticCodeService extends BaseService {

    public static final Integer TIME_UNIT_CODE_BOOK_ID = 100;
    public static final Integer DAYS_OF_WEEK_CODE_BOOK_ID = 200;
    public static final Integer NON_RECIPE_SUBSTITUTION_CODE_BOOK_ID = 300;
    public static final Integer USER_INTERACTION_EVENT_CODE_BOOK_ID = 400;

    private final CodeBookRepository codeBookRepository;
    private final CodeValueRepository codeValueRepository;

    private List<CodeBook> codeBook;

    public StaticCodeService(CodeBookRepository codeBookRepository, CodeValueRepository codeValueRepository) {
        this.codeBookRepository = codeBookRepository;
        this.codeValueRepository = codeValueRepository;
        this.codeBook = this.codeBookRepository.findAll();
    }

    /**
     * Retrieves all static code entries from the CodeBook repository. If the list
     * of CodeBook entries is already cached within the service, the cached list
     * is returned. Otherwise, it fetches all entries from the repository, caches
     * them, and then returns the list.
     *
     * @return a list of all CodeBook entries available in the repository
     */
    @Transactional
    public List<CodeBook> getAllStaticCode() {
        if(codeBook == null) {
            this.codeBook = this.codeBookRepository.findAll();
        }

        return this.codeBook;
    }

    /**
     * Retrieves a CodeValue entity based on its unique identifier.
     * This method queries the CodeValueRepository to find the corresponding
     * CodeValue instance for the given codeValueId.
     *
     * @param codeValueId the unique identifier of the CodeValue entity to be retrieved
     * @return an Optional containing the CodeValue if found, or an empty Optional if not found
     */
    public Optional<CodeValue> getCodeValueUsingCodeValueId(Integer codeValueId) {
        return this.codeValueRepository.findById(codeValueId);
    }

    /**
     * Retrieves an Optional containing a CodeBook object based on a given CodeBook ID.
     * This method filters the cached list of CodeBook objects to find the one
     * whose ID matches the provided codebookID. If no matching CodeBook is found
     * or if the cached list is null, an empty Optional is returned.
     *
     * @param codebookID the unique identifier of the CodeBook to be retrieved
     * @return an Optional containing the matching CodeBook if found, or an empty Optional otherwise
     */
    public Optional<CodeBook> getCodeValueListUsingCodeBookID(Integer codebookID) {
        if(codeBook != null) {
            return this.codeBook.stream().filter(codeBook1 -> Objects.equals(codeBook1.getId(), codebookID)).findFirst();
        }
        return Optional.empty();
    }

}
