package org.group2.comp313.kitchen_companion.domain.static_code;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "code_book")
public class CodeBook {
    @Id
    @Column(name = "code_book_id", nullable = false)
    private Long id;

    @Size(max = 255)
    @NotNull
    @Column(name = "label", nullable = false)
    private String label;

    @NotNull
    @Column(name = "created_at", nullable = false)
    @JsonIgnore
    private Instant createdAt;

    @Size(max = 255)
    @NotNull
    @Column(name = "created_by", nullable = false)
    @JsonIgnore
    private String createdBy;

    @Column(name = "updated_at")
    @JsonIgnore
    private Instant updatedAt;

    @Size(max = 255)
    @Column(name = "updated_by")
    @JsonIgnore
    private String updatedBy;

    @OneToMany(mappedBy = "codeBook", fetch = FetchType.EAGER)
    @OrderBy(value = "code_value_id asc ")
    private Set<CodeValue> codeValues = new LinkedHashSet<>();

    public Long getId() {
        return id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public Set<CodeValue> getCodeValues() {
        return codeValues;
    }

    public void setCodeValues(Set<CodeValue> codeValues) {
        this.codeValues = codeValues;
    }
}