package org.group2.comp313.kitchen_companion.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "code_book")
public class CodeBook {
    @Id
    @Column(name = "code_book_id", nullable = false)
    private Integer id;

    @Size(max = 256)
    @NotNull
    @Column(name = "label", nullable = false, length = 256)
    private String label;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private Instant createdAt;

    @Size(max = 256)
    @NotNull
    @Column(name = "created_by", nullable = false, length = 256)
    private String createdBy;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Size(max = 256)
    @Column(name = "updated_by", length = 256)
    private String updatedBy;

    @OneToMany(mappedBy = "codeBook", fetch = FetchType.EAGER)
    @OrderBy(value = "code_value_id asc")
    private Set<CodeValue> codeValues = new LinkedHashSet<>();

}