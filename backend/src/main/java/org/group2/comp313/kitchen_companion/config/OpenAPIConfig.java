package org.group2.comp313.kitchen_companion.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;

import java.util.List;

@Configuration
public class OpenAPIConfig {

    @Value("${recipe.openapi.dev-url}")
    private String devUrl;

    @Value("${recipe.openapi.prod-url}")
    private String prodUrl;

    @Bean
    public OpenAPI myOpenAPI() {
        Server devServer = new Server();
        devServer.setUrl(devUrl);
        devServer.setDescription("Server URL in Development environment");

        Server prodServer = new Server();
        prodServer.setUrl(prodUrl);
        prodServer.setDescription("Server URL in Production environment");

        Contact contact = new Contact();
        contact.setEmail("rombao@my.centennialcollege.ca");
        contact.setName("Comp 311 - Group 2");
        contact.setUrl("");

        License mitLicense = new License().name("MIT License").url("https://choosealicense.com/licenses/mit/");

        Info info = new Info()
                .title("Kitchen Companion")
                .version("1.0")
                .contact(contact)
                .description("Kitchen Companion API - Developed By Group 3 \n Cathy, Hung, Ronald, Khayam, Chantelle, Khyati")
                .license(mitLicense);

        return new OpenAPI().info(info).servers(List.of(devServer, prodServer));
    }
}
