package org.group2.comp313.kitchen_companion.service;

import jakarta.transaction.Transactional;
import org.group2.comp313.kitchen_companion.domain.Tenant;
import org.group2.comp313.kitchen_companion.dto.tenant.CreateUpdateTenantDTO;
import org.group2.comp313.kitchen_companion.dto.tenant.TenantDto;
import org.group2.comp313.kitchen_companion.dto.user.UserRegistrationDto;
import org.group2.comp313.kitchen_companion.mapper.tenant.TenantMapper;
import org.group2.comp313.kitchen_companion.repository.TenantRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TenantService extends BaseService {

    private final TenantRepository tenantRepository;
    private final TenantMapper tenantMapper;
    private final KeycloakClientService keycloakClientService;

    public TenantService(TenantRepository tenantRepository, TenantMapper tenantMapper, KeycloakClientService keycloakClientService) {
        this.tenantRepository = tenantRepository;
        this.tenantMapper = tenantMapper;
        this.keycloakClientService = keycloakClientService;
    }

    public  TenantDto getTenant(Long id) {

        Optional<Tenant> tenant = this.tenantRepository.findById(id);

        return tenant.map(this.tenantMapper::toDto).orElse(null);
    }

    /**
     * Get All Existing Tenants.
     * @return
     */
    public List<TenantDto> getAllTenants() {

        List<Tenant> tenants = this.tenantRepository.findAll();
        List<TenantDto> tenantDTOList = new ArrayList<>();

        for (Tenant tenant : tenants) {
            tenantDTOList.add(this.tenantMapper.toDto(tenant));
        }

        return tenantDTOList;
    }

    /**
     * Create New Tenant and Register new user.
     * @param dto
     */
    @Transactional(rollbackOn = {WebClientResponseException.class, Exception.class})
    public void createTenant(UserRegistrationDto dto) {

        Tenant newTenant = new Tenant();

        newTenant.setCreatedBy(dto.getEmail());
        newTenant.setLabel(dto.getCompanyName());
        newTenant.setPrimaryEmail(dto.getEmail());
        newTenant.setCreatedAt(Instant.now());

        newTenant = this.tenantRepository.save(newTenant);

        //After Creating New Tenant - Create the new user in the IAM platform
        this.keycloakClientService.registerNewUser(dto, newTenant.getId(), true);
    }

    /**
     * Update Tenant
     * @param id
     * @param dto
     * @param username
     * @return
     */
    public TenantDto updateTenant(Long id, CreateUpdateTenantDTO dto, String username){

        Optional<Tenant> tenant = this.tenantRepository.findById(id);

        if (tenant.isEmpty()) {
            return null;
        }

        tenant.get().setPrimaryEmail(dto.email());
        tenant.get().setLabel(dto.companyName());
        tenant.get().setUpdatedAt(Instant.now());
        tenant.get().setUpdatedBy(username);

        this.tenantRepository.save(tenant.get());

        return this.tenantMapper.toDto(tenant.get());
    }
}
