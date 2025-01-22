package org.group2.comp313.kitchen_companion.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import org.group2.comp313.kitchen_companion.validator.CodeValueValidator;

import java.lang.annotation.*;

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