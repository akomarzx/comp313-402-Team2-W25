package org.group2.comp313.kitchen_companion.mapper.user;

import org.group2.comp313.kitchen_companion.dto.user.UserSummaryInfoDto;
import org.keycloak.representations.idm.UserRepresentation;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserRepresentationMapper {
    UserRepresentation toEntity(UserSummaryInfoDto userSummaryInfoDto);

    UserSummaryInfoDto toDto(UserRepresentation userRepresentation);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    UserRepresentation partialUpdate(UserSummaryInfoDto userSummaryInfoDto, @MappingTarget UserRepresentation userRepresentation);
}