package org.group2.comp313.kitchen_companion.dto.recipe;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record StepGroupDTO(
        @NotNull @Min(0) int stepGroupOrder,
        @Size(max = 255) String label,
        @NotNull @Size(min = 1) List<@Valid StepDTO> steps
) {}
