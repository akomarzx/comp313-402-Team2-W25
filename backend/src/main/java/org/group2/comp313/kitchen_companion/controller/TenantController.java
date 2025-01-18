package org.group2.comp313.kitchen_companion.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.group2.comp313.kitchen_companion.dto.tenant.CreateUpdateTenantDTO;
import org.group2.comp313.kitchen_companion.dto.tenant.TenantDto;
import org.group2.comp313.kitchen_companion.service.TenantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@SecurityRequirement(name = "Keycloak")
@RequestMapping("/tenant")
@Tag(name = "Tenant", description = "Endpoints for Tenant Management")
public class TenantController extends BaseController{
    private final TenantService tenantService;

    public TenantController(TenantService tenantService) {
        this.tenantService = tenantService;
    }

    @GetMapping()
    public ResponseEntity<List<TenantDto>> getAllTenants() {
        List<TenantDto> list = this.tenantService.getAllTenants();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TenantDto> getTenant(@NotNull @PathVariable("id") Long id,
                                               @AuthenticationPrincipal(expression = "claims['tenant_id']") String tenantId) throws Exception {

        if(validateIfTenantIDMatched(id, tenantId)) {
            throw new Exception("Invalid Tenant Id");
        }

        TenantDto dto = this.tenantService.getTenant(id);

        if(dto != null) {
            return new ResponseEntity<>(dto, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }

    }

    @PatchMapping("/{id}")
    public ResponseEntity<TenantDto> updateTenant(@NotNull @PathVariable("id") Long id ,
                                                  @Valid @RequestBody CreateUpdateTenantDTO createUpdateTenantDTO,
                                                  @AuthenticationPrincipal(expression = "claims['email']") String username,
                                                  @AuthenticationPrincipal(expression = "claims['tenant_id']") String tenantId) throws Exception {

        if(validateIfTenantIDMatched(id, tenantId)) {
            throw new Exception("Invalid Tenant Id");
        }

        TenantDto updateTenantDto = this.tenantService.updateTenant(id, createUpdateTenantDTO, username);

        if (updateTenantDto != null) {
            return new ResponseEntity<>(updateTenantDto, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    private boolean validateIfTenantIDMatched(Long tenantIDFromPath, String tenantIdFromPrincipal) {
        return !Objects.equals(tenantIDFromPath, Long.parseLong(tenantIdFromPrincipal));
    }
}
