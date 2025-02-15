package org.group2.comp313.kitchen_companion.config;

import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

//@Configuration
public class FlywayConfiguration {

    //@Bean
    public FlywayMigrationStrategy flywayMigrationStrategy() {
        return flyway -> {
            // Repair any broken migrations (fixes checksum errors or failed migrations)
            flyway.repair();
            // Now run the migration
            flyway.migrate();
        };
    }
}