package org.group2.comp313.kitchen_companion.dto.recipe;

public record ApiResult<T>(
        String message,
        T result
) {
}
