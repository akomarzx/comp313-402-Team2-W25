package org.group2.comp313.kitchen_companion.utility;

/**
 * Exception thrown when an entity intended to be updated cannot be found.
 * This exception is typically used in scenarios where operations are attempted
 * on entities that do not exist in the system.
 *
 * This exception extends RuntimeException, allowing it to be used for unchecked
 * exceptions where the existence of the entity should be verified prior to any update attempt.
 *
 * Constructors are provided for messages and optional causes to allow for context-specific
 * error reporting.
 */
public class EntityToBeUpdatedNotFoundException extends RuntimeException {

    public EntityToBeUpdatedNotFoundException(String message, Throwable err) {
        super(message, err);
    }
    public EntityToBeUpdatedNotFoundException(String message) {
        super(message);
    }
}
