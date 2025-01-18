package org.group2.comp313.kitchen_companion.config;

import jakarta.servlet.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.io.IOException;

/**
 * Filter to extract Tenant ID in JWT
 */
public class ExtractTenantFilter implements Filter {
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication != null) {
            JwtAuthenticationToken token = (JwtAuthenticationToken) authentication;
            TenantContext.setCurrentTenant(Long.parseLong(token.getTokenAttributes().get("tenant_id").toString()));
        }
        filterChain.doFilter(servletRequest, servletResponse);
    }
}
