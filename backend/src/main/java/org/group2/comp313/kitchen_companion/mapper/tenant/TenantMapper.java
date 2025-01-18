package org.group2.comp313.kitchen_companion.mapper.tenant;

import org.group2.comp313.kitchen_companion.dto.tenant.TenantDto;
import org.group2.comp313.kitchen_companion.domain.Tenant;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface TenantMapper {
    @Mapping(source = "companyName", target = "label")
    Tenant toEntity(TenantDto tenantDto);

    @Mapping(source = "label", target = "companyName")
    TenantDto toDto(Tenant tenant);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(source = "companyName", target = "label")
    Tenant partialUpdate(TenantDto tenantDto, @MappingTarget Tenant tenant);
}