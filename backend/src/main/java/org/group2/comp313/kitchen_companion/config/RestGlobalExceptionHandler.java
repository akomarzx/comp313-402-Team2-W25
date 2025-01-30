package org.group2.comp313.kitchen_companion.config;

import org.group2.comp313.kitchen_companion.utility.ErrorMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class RestGlobalExceptionHandler {

    @ExceptionHandler(value = {MethodArgumentNotValidException.class})
    public ResponseEntity<Map<String, String>> invalidRequestBody(MethodArgumentNotValidException ex, WebRequest request) {
        Map<String, String> validationErrorMessage = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(fieldError -> {
            validationErrorMessage.put(fieldError.getField(), fieldError.getDefaultMessage());
        });

        return new ResponseEntity<>(validationErrorMessage, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {Exception.class})
    public ResponseEntity<ErrorMessage> invalidRequestBody(Exception ex, WebRequest request) {
        ErrorMessage message = new ErrorMessage(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                LocalDateTime.now(),
                ex.getMessage());

        return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
