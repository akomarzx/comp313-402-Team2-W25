package org.group2.comp313.kitchen_companion.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.group2.comp313.kitchen_companion.annotation.ValidateCodeID;
import org.group2.comp313.kitchen_companion.domain.CodeBook;
import org.group2.comp313.kitchen_companion.service.StaticCodeService;

import java.util.Objects;
import java.util.Optional;

public class CodeValueValidator implements ConstraintValidator<ValidateCodeID, Integer> {

    private static final Log log = LogFactory.getLog(CodeValueValidator.class);
    private final StaticCodeService staticCodeService;
    private Integer codeBookID;
    public CodeValueValidator(StaticCodeService staticCodeService) {
        this.staticCodeService = staticCodeService;
    }

    @Override
    public void initialize(ValidateCodeID constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
        this.codeBookID = this.getCodeBookID(constraintAnnotation.codeTypeName());
        log.info("Code book ID: " + this.codeBookID);
    }

    @Override
    public boolean isValid(Integer id, ConstraintValidatorContext constraintValidatorContext) {
        Optional<CodeBook> codeValueList = this.staticCodeService.getCodeValueListUsingCodeBookID(codeBookID);
        if (id == null) {
            return true;
        }
        return codeValueList.map(codeBook -> codeBook.getCodeValues().stream().anyMatch(codeValue -> Objects.equals(codeValue.getId(), id))).orElse(false);
    }

    private Integer getCodeBookID(String parameter) {
        if (parameter.equalsIgnoreCase("TIME_UNIT")) {
            return StaticCodeService.TIME_UNIT_CODE_BOOK_ID;
        } else {
            return null;
        }
    }
}