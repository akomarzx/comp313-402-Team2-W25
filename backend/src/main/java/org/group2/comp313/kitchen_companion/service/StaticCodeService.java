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

    private final CodeBookRepository codeBookRepository;
    private final CodeValueRepository codeValueRepository;
    public final Integer TIME_UNIT_CODE_BOOK_ID = 100;
    private List<CodeBook> codeBook;

    public StaticCodeService(CodeBookRepository codeBookRepository, CodeValueRepository codeValueRepository) {
        this.codeBookRepository = codeBookRepository;
        this.codeValueRepository = codeValueRepository;
        this.codeBook = this.codeBookRepository.findAll();
    }

    @Transactional
    public List<CodeBook> getAllStaticCode() {
        if(codeBook == null) {
            this.codeBook = this.codeBookRepository.findAll();
        }

        return this.codeBook;
    }

    public Optional<CodeValue> getCodeValueUsingCodeValueId(Integer codeValueId) {
        return this.codeValueRepository.findById(codeValueId);
    }

    public Optional<CodeBook> getCodeValueListUsingCodeBookID(Integer codebookID) {
        if(codeBook != null) {
            return this.codeBook.stream().filter(codeBook1 -> Objects.equals(codeBook1.getId(), codebookID)).findFirst();
        }
        return Optional.empty();
    }

}
