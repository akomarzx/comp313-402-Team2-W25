package org.group2.comp313.kitchen_companion.utility;

/**
 * Exception thrown when there is a mismatch in IDs during an operation.
 * This typically occurs when the provided ID does not match the expected ID
 * in the context of an operation, such as resource updates or deletions.
 *
 * IdMismatchedException extends RuntimeException, enabling the application
 * to handle ID mismatches as unchecked exceptions. It provides constructors
 * to include an error message and an optional cause, allowing for detailed
 * exception tracing and reporting.
 */
public class IdMismatchedException extends RuntimeException {

    public IdMismatchedException(String message) {
        super(message);
    }
    public IdMismatchedException(String message, Throwable cause) {
        super(message, cause);
    }
}
