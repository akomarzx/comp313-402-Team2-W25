package org.group2.comp313.kitchen_companion.utility;

public class IdMismatchedException extends RuntimeException {

    public IdMismatchedException(String message) {
        super(message);
    }
    public IdMismatchedException(String message, Throwable cause) {
        super(message, cause);
    }
}
