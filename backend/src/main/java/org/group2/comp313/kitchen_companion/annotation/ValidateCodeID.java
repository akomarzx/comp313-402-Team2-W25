package org.group2.comp313.kitchen_companion.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import org.group2.comp313.kitchen_companion.validator.CodeValueValidator;

import java.lang.annotation.*;

/**
 * Annotation used to validate that a given integer ID corresponds to a valid code value
 * within a specific code type. The code type is determined by the {@code codeTypeName}
 * parameter, which specifies the name of the code category to be validated against.
 *
 * The validation logic is implemented in the {@code CodeValueValidator} class, which
 * ensures that the provided ID exists in the associated code book within the application.
 *
 * This annotation can be used on fields or method parameters to enforce the validation
 * constraint. By default, an error message of "Invalid Code Value Id" will be shown
 * when validation fails, but this message can be customized.
 *
 * Attributes:
 * - `message` defines the error message to be displayed when validation fails.
 * - `codeTypeName` specifies the name of the code book or type to validate within.
 * - `groups` allows grouping constraints (a feature of the Bean Validation API).
 * - `payload` provides metadata for the constraint's clients or consumers.
 *
 * Example Usage:
 * The annotation can be applied to fields or parameters that need validation for their
 * corresponding IDs within the pre-configured static codes.
 *
 * This annotation is retained at runtime and is part of the class documentation, making
 * it compatible with runtime reflection or frameworks like Spring.
 *
 * An example use case can involve a field annotated with @ValidateCodeID in a record
 * describing an entity that contains IDs that need to be matched to pre-defined static
 * codes for consistency and correctness, such as identifiers for time units.
 */
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(validatedBy = CodeValueValidator.class)
public @interface ValidateCodeID {

    public String message() default "Invalid Code Value Id";
    public String codeTypeName();
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}