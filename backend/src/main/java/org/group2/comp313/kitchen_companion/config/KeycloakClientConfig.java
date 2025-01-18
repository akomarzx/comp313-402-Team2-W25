package org.group2.comp313.kitchen_companion.config;

import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KeycloakClientConfig {

    @Value("${keycloak-admin-rest-api}")
    private String keycloakBaseUrl;

    public String getRealm() {
        return realm;
    }

    @Value("${keycloak-realm}")
    private String realm;

    @Value("${springdoc.swagger-ui.oauth.client-id}")
    private String clientId;

    @Value("${springdoc.swagger-ui.oauth.client-secret}")
    private String clientSecret;

    @Bean
    public Keycloak keycloak() {

        return KeycloakBuilder.builder()
                .serverUrl(keycloakBaseUrl)
                .realm(realm)
                .grantType(OAuth2Constants.CLIENT_CREDENTIALS)
                .clientId(clientId)
                .clientSecret(clientSecret)
                .build();
    }

    public RealmResource realmRepresentation() {
        return this.keycloak().realm(this.realm);
    }

    public UsersResource usersResource() {
        return this.realmRepresentation().users();
    }
}
