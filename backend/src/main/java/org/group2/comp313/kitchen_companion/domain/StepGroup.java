package org.group2.comp313.kitchen_companion.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "step_group")
public class StepGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "step_group_id", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "step_group_order", nullable = false)
    private Integer stepGroupOrder;

    @NotNull
    @Column(name = "recipe_id", nullable = false)
    private Integer recipe;

    @Size(max = 255)
    @NotNull
    @ColumnDefault("''")
    @Column(name = "label", nullable = false)
    private String label;

    @Size(max = 256)
    @NotNull
    @Column(name = "created_by", nullable = false, length = 256)
    private String createdBy;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Size(max = 256)
    @Column(name = "updated_by", length = 256)
    private String updatedBy;

    @OneToMany(mappedBy = "stepGroup", fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    @Fetch(FetchMode.JOIN)
    private Set<Step> steps = new LinkedHashSet<>();

}