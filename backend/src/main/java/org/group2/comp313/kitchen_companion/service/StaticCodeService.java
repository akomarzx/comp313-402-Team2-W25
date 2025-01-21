package org.group2.comp313.kitchen_companion.service;

import org.springframework.stereotype.Service;

/**
 * Service for Static Code for the API
 */
@Service
public class StaticCodeService extends BaseService {

//    private final CodeBookRepository codeBookRepository;
//
//    private List<CodeBook> codeBook;
//
//    public StaticCodeService(CodeBookRepository codeBookRepository) {
//        this.codeBookRepository = codeBookRepository;
//        //this.codeBook = this.codeBookRepository.findAll();
//    }
//
//    public List<CodeBook> getAllStaticCode() {
//        if(codeBook == null) {
//            this.codeBook = this.codeBookRepository.findAll();
//        }
//
//        return this.codeBook;
//    }
//
//    public Optional<CodeBook> getCodeValueListUsingCodeBookID(Long codebookID) {
//        if(codeBook != null) {
//            return this.codeBook.stream().filter(codeBook1 -> Objects.equals(codeBook1.getId(), codebookID)).findFirst();
//        }
//        return Optional.empty();
//    }
//
}
