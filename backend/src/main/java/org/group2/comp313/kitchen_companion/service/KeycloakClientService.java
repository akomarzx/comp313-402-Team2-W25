package org.group2.comp313.kitchen_companion.service;

import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.core.Response;
import org.group2.comp313.kitchen_companion.config.KeycloakClientConfig;
import org.group2.comp313.kitchen_companion.dto.user.UserRegistrationDto;
import org.group2.comp313.kitchen_companion.dto.user.UserUpdateDto;
import org.group2.comp313.kitchen_companion.mapper.user.UserRepresentationMapper;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class KeycloakClientService extends BaseService {
    private final KeycloakClientConfig clientConfig;
    private final UserRepresentationMapper userRepresentationMapper;

    public KeycloakClientService(KeycloakClientConfig config, UserRepresentationMapper userRepresentationMapper) {
        this.clientConfig = config;
        this.userRepresentationMapper = userRepresentationMapper;
    }

    /**
     * Send Request to Create New User in the IAM platform
     * @param dto
     * @param tenantId
     * @param isNewCustomerRegistration
     */
    public void registerNewUser(UserRegistrationDto dto, Long tenantId, boolean isNewCustomerRegistration) {

        UsersResource usersResource = this.clientConfig.usersResource();
        UserRepresentation userRepresentation = mapNewUserRepresentationDTO(dto, tenantId, isNewCustomerRegistration);

        try(Response response = usersResource.create(userRepresentation)) {
            log.info("Creating new User: " + response.getStatus());
            if(response.getStatus() != HttpStatus.CREATED.value()) {
                throw new Exception("Failed to register new user." + "IAM StatusCode: " + response.getStatus());
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Update User Info in IAM platform
     * @param userId
     * @param userUpdateDto
     * @param tenantId
     */
    public void updateUser(@NotNull String userId, @NotNull UserUpdateDto userUpdateDto, Long tenantId) {
//
//        UsersResource usersResource = this.clientConfig.usersResource();
//
//        UserRepresentation updateRepresentation = new UserRepresentation();
//
//        if(userUpdateDto.getFirstName() != null) {
//            updateRepresentation.setFirstName(userUpdateDto.getFirstName());
//        }
//
//        if(userUpdateDto.getLastName() != null) {
//            updateRepresentation.setLastName(userUpdateDto.getLastName());
//        }
//
//        updateRepresentation.setGroups(getGroupNameByCode(userUpdateDto.getGroupCodes()));
//        UserResource userResource = usersResource.get(userId);
//        userResource.update(updateRepresentation);
//
//        this.updateUserGroups(this.getGroupNameByCode(userUpdateDto.getGroupCodes()), userResource);
    }

    /**
     * Create UserRepresentation from request object
     * @param dto
     * @param tenantId
     * @param newCustomerRegistration
     * @return
     */
    private UserRepresentation mapNewUserRepresentationDTO(@NotNull UserRegistrationDto dto, @NotNull Long tenantId, boolean newCustomerRegistration) {

        UserRepresentation keycloakUserRepresentationDto = new UserRepresentation();

        CredentialRepresentation credentialRepresentation = new CredentialRepresentation();
        credentialRepresentation.setValue(dto.getPassword());
        credentialRepresentation.setTemporary(false);
        credentialRepresentation.setType(CredentialRepresentation.PASSWORD);

        keycloakUserRepresentationDto.setUsername(dto.getUsername());
        keycloakUserRepresentationDto.setEmail(dto.getEmail());
        keycloakUserRepresentationDto.setEmailVerified(true);
        keycloakUserRepresentationDto.setEnabled(true);
        keycloakUserRepresentationDto.setFirstName(dto.getFirstName());
        keycloakUserRepresentationDto.setLastName(dto.getLastName());
        keycloakUserRepresentationDto.setCredentials(List.of(credentialRepresentation));

        return keycloakUserRepresentationDto;
    }

}
