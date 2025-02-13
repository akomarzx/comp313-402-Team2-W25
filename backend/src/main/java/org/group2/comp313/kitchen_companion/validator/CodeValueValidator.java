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

/**
 * CodeValueValidator is a custom implementation of the ConstraintValidator interface
 * used to validate whether an Integer value corresponds to a valid entry in a CodeBook.
 * This validation is based on a predefined code type represented by a CodeBook ID.
 *
 * Using the ValidateCodeID annotation, this validator ensures that any integer ID provided
 * belongs to a specific group of code values within a defined code type.
 *
 * This validator works in conjunction with StaticCodeService to retrieve code books and
 * determines valid IDs. It requires the following workflow:
 * - Retrieves the CodeBook ID by mapping the `codeTypeName` from the annotation to its corresponding value.
 * - Retrieves the list of code values from the detected CodeBook.
 * - Verifies if the provided ID exists in the retrieved list of code values.
 *
 * If the provided ID is null, the validation is considered successful, indicating that
 * null values are deemed valid by this implementation.
 *
 * Key methods and their responsibilities:
 * - initialize(ValidateCodeID): Initializes the validator with the annotation data and
 *   determines the CodeBook ID corresponding to the provided `codeTypeName`.
 * - isValid(Integer, ConstraintValidatorContext): Validates whether the provided ID
 *   exists in the assigned CodeBook.
 * - getCodeBookID(String): A private helper method to resolve the CodeBook ID based on
 *   the `codeTypeName` parameter.
 *
 * This class also logs relevant information during initialization, including the resolved
 * CodeBook ID, which can help with debugging the validation process.
 */
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