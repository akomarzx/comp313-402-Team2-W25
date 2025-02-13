package org.group2.comp313.kitchen_companion.utility;

import java.time.LocalDateTime;

/**
 * Represents an error message with relevant details such as status code, timestamp, and message.
 * This class is typically used to encapsulate error information returned to the client
 * in the case of exceptions or failures.
 *
 * Fields:
 * - statusCode: The HTTP status code associated with the error.
 * - timestamp: The time when the error occurred.
 * - message: A descriptive message about the error.
 *
 * The class is immutable and provides getter methods to access its fields.
 */
public class ErrorMessage {

    private final int statusCode;
    private final LocalDateTime timestamp;
    private final String message;

    public ErrorMessage(int statusCode, LocalDateTime timestamp, String message) {
        this.statusCode = statusCode;
        this.timestamp = timestamp;
        this.message = message;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public String getMessage() {
        return message;
    }

}
