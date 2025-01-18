package org.group2.comp313.kitchen_companion.dto.tenant;

import org.group2.comp313.kitchen_companion.domain.Tenant;

import java.io.Serializable;

/**
 * DTO for {@link Tenant}
 */
public record CreateUpdateTenantDTO(String companyName, String email) implements Serializable { }