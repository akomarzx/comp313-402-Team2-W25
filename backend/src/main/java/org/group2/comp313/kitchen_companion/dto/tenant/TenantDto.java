package org.group2.comp313.kitchen_companion.dto.tenant;

import org.group2.comp313.kitchen_companion.domain.Tenant;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link Tenant}
 */
public record TenantDto(Long id, String companyName, String primaryEmail, Instant createdAt, String createdBy,
                        Instant updatedAt, String updatedBy) implements Serializable {
}