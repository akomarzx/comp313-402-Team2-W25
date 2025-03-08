package org.group2.comp313.kitchen_companion.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "user_interaction")
public class UserInteraction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_interaction_id", nullable = false)
    private Integer id;

    @Size(max = 255)
    @Column(name = "created_by")
    private String createdBy;

    @Size(max = 255)
    @Column(name = "session_id")
    private String sessionId;

    @NotNull
    @Column(name = "recipe_id", nullable = false)
    private Integer recipe;

    @NotNull
    @Column(name = "user_interaction_event_type_code", nullable = false)
    private Integer userInteractionEventTypeCode;

}