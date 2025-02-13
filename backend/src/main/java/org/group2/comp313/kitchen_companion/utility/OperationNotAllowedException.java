package org.group2.comp313.kitchen_companion.utility;

/**
 * Exception thrown when an operation is attempted that is not allowed in the current context.
 *
 * This exception is typically used to signal that a specific action violates predefined
 * business rules, system constraints, or user permissions. It extends RuntimeException,
 * allowing it to be thrown without being explicitly declared.
 *
 * The constructors allow for a detailed error message and an optional throwable cause
 * to provide additional context and facilitate debugging.
 */
public class OperationNotAllowedException extends RuntimeException {

    public OperationNotAllowedException(String message, Throwable err) {
        super(message, err);
    }
    public OperationNotAllowedException(String message) {
        super(message);
    }
}
