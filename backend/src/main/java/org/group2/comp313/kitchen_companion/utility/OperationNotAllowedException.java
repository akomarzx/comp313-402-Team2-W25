package org.group2.comp313.kitchen_companion.utility;

public class OperationNotAllowedException extends RuntimeException {

    public OperationNotAllowedException(String message, Throwable err) {
        super(message, err);
    }
    public OperationNotAllowedException(String message) {
        super(message);
    }
}
