package org.group2.comp313.kitchen_companion.dto;

public record ApiResult<T>(
        String message,
        T result
) {
}
