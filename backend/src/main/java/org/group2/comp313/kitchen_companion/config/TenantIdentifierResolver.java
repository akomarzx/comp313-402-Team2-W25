package org.group2.comp313.kitchen_companion.config;

import org.hibernate.cfg.AvailableSettings;
import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Enable Multi Tenancy via discriminator column
 */
@Component
public class TenantIdentifierResolver implements CurrentTenantIdentifierResolver<Long>, HibernatePropertiesCustomizer {

    private Long currentTenant = 0L;

    @Override
    public Long resolveCurrentTenantIdentifier() {
        currentTenant = TenantContext.getCurrentTenant();
        if(currentTenant != null) {
            return currentTenant;
        } else {
            return 1L;
        }
    }

    @Override
    public boolean validateExistingCurrentSessions() {
        return true;
    }

    @Override
    public boolean isRoot(Long tenantId) {
        return CurrentTenantIdentifierResolver.super.isRoot(tenantId);
    }

    @Override
    public void customize(Map<String, Object> hibernateProperties) {
        hibernateProperties.put(AvailableSettings.MULTI_TENANT_IDENTIFIER_RESOLVER, this);
    }

    public void setCurrentTenant(Long currentTenant) {
        this.currentTenant = currentTenant;
    }
}