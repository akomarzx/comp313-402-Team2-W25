package org.group2.comp313.kitchen_companion.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.apache.commons.lang3.ObjectUtils;
import org.group2.comp313.kitchen_companion.dto.user.UserRegistrationDto;
import org.group2.comp313.kitchen_companion.dto.user.UserUpdateDto;
import org.group2.comp313.kitchen_companion.service.KeycloakClientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/user")
@SecurityRequirement(name = "Keycloak")
@Tag(name = "User Management", description = "Endpoints for User Management")
public class UserController extends BaseController{

    private final KeycloakClientService keycloakClientService;

    public UserController(KeycloakClientService service) {
        this.keycloakClientService = service;
    }

    @GetMapping
    @Operation(description = "Create new user")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ObjectUtils.Null> addNewUserForTenant(
                                                                //@AuthenticationPrincipal(expression = "claims['tenant_id']") String tenantId
                                                                ) {
        //this.keycloakClientService.registerNewUser(userRegistrationDto, Long.parseLong(tenantId), false);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(description = "Update User Information")
    public ResponseEntity<ObjectUtils.Null> updateUserForTenant(@NotNull @PathVariable("id") String userId,
                                                                @Valid @RequestBody UserUpdateDto userUpdateDto,
                                                                @AuthenticationPrincipal(expression = "claims['tenant_id']") String tenantId) {

        this.keycloakClientService.updateUser(userId, userUpdateDto, Long.parseLong(tenantId));
        return new ResponseEntity<>(HttpStatus.OK);
    }

}