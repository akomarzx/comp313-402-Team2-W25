package org.group2.comp313.kitchen_companion.config;

/**
 * Thread Safe Container for tenant ID
 */
public class TenantContext {
    private static ThreadLocal<Long> currentTenant = new InheritableThreadLocal<>();

    public static Long getCurrentTenant() {
        return currentTenant.get();
    }

    public static void setCurrentTenant(Long tenant) {
        currentTenant.set(tenant);
    }

    public static void clear() {
        currentTenant.set(null);
    }
}
