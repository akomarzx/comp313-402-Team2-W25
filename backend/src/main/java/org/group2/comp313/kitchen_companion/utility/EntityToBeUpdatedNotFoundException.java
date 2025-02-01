package org.group2.comp313.kitchen_companion.utility;

public class EntityToBeUpdatedNotFoundException extends RuntimeException {

    public EntityToBeUpdatedNotFoundException(String message, Throwable err) {
        super(message, err);
    }
    public EntityToBeUpdatedNotFoundException(String message) {
        super(message);
    }
}
