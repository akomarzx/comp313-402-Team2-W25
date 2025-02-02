package org.group2.comp313.kitchen_companion.mapper;

import org.group2.comp313.kitchen_companion.domain.CodeValue;
import org.group2.comp313.kitchen_companion.repository.CodeValueRepository;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

@Component
public class CodeValueMapper {

    private final CodeValueRepository codeValueRepository;

    public CodeValueMapper(CodeValueRepository codeValueRepository) {
        this.codeValueRepository = codeValueRepository;
    }

    @Named("toEntity")
    public CodeValue toEntity(Integer id) {
        if (id == null) {
            return null;
        }
        return codeValueRepository.findById(id).orElse(null);
    }

    @Named("toDto")
    public Integer toDto(CodeValue codeValue) {
        return (codeValue != null) ? codeValue.getId() : null;
    }
}
