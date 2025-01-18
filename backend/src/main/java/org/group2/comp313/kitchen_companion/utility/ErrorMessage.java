package org.group2.comp313.kitchen_companion.utility;

import java.time.LocalDateTime;

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
